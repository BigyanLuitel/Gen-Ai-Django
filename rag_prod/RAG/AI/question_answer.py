import logging
import json
import requests
from pathlib import Path
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import os
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage, convert_to_messages
from langchain_core.documents import Document
from langchain_groq import ChatGroq

from dotenv import load_dotenv
load_dotenv(override=True)

logger = logging.getLogger("RAG.AI")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "llama-3.3-70b-versatile")
DB_NAME = str(Path(__file__).parent.parent / "vector_db")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
RETRIEVAL_K = 4
name = "Bigyan Luitel"

SYSTEM_PROMPT = """
You are an AI assistant representing **{name}** on their personal portfolio website.
...
## CONTEXT
{context}
"""

vector_store = Chroma(persist_directory=DB_NAME, embedding_function=embeddings)
retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": RETRIEVAL_K}
)
llm = ChatGroq(model=MODEL_NAME, temperature=0, api_key=GROQ_API_KEY)


def fetch_context(question: str) -> list[Document]:
    docs = retriever.invoke(question)
    for i, doc in enumerate(docs):
        logger.info("  chunk[%d]: %s", i, doc.page_content[:100])
    return docs


def push(text: str):
    requests.post(
        "https://api.pushover.net/1/messages.json",
        data={
            "token": os.getenv("PUSHOVER_TOKEN"),
            "user": os.getenv("PUSHOVER_USER"),
            "message": text,
        }
    )


def record_user_details(email, name="Name not provided", notes="not provided"):
    push(f"Recording {name} with email {email} and notes {notes}")
    return {"recorded": "ok"}


def record_unknown_question(question):
    push(f"Recording unknown question: {question}")
    return {"recorded": "ok"}


record_user_details_json = {
    "name": "record_user_details",
    "description": "Use this tool to record that a user is interested in being in touch and provided an email address",
    "parameters": {
        "type": "object",
        "properties": {
            "email": {"type": "string", "description": "The email address of this user"},
            "name": {"type": "string", "description": "The user's name, if they provided it"},
            "notes": {"type": "string", "description": "Any additional information about the conversation"}
        },
        "required": ["email"],
        "additionalProperties": False
    }
}

record_unknown_question_json = {
    "name": "record_unknown_question",
    "description": "Always use this tool to record any question that couldn't be answered",
    "parameters": {
        "type": "object",
        "properties": {
            "question": {"type": "string", "description": "The question that couldn't be answered"}
        },
        "required": ["question"],
        "additionalProperties": False
    }
}

tools = [
    {"type": "function", "function": record_user_details_json},
    {"type": "function", "function": record_unknown_question_json}
]


def handle_tool_call(tool_calls):  # Fix: removed 'self'
    results = []
    for tool_call in tool_calls:
        tool_name = tool_call["name"]
        arguments = tool_call["args"]  # LangChain format
        logger.info("Tool called: %s", tool_name)
        tool = globals().get(tool_name)
        result = tool(**arguments) if tool else {}
        results.append(
            ToolMessage(
                content=json.dumps(result),
                tool_call_id=tool_call["id"]
            )
        )
    return results


def combined_question_context_prompt(question: str, history: list[dict]) -> str:
    recent_user_msgs = [m["content"] for m in history if m.get("role") == "user"]
    if recent_user_msgs:
        return recent_user_msgs[-1] + " " + question
    return question


def answer_question(question: str, history: list[dict] | None = None) -> tuple[str, list[Document]]:
    history = history or []  # Fix: avoid mutable default argument
    logger.info("RAG query: %s", question)
    try:
        combined = combined_question_context_prompt(question, history)
        docs = fetch_context(combined)
        logger.info("Retrieved %d context chunks", len(docs))
        context = "\n\n".join(doc.page_content for doc in docs)

        # Fix: pass both {name} and {context}
        system_prompt = SYSTEM_PROMPT.format(name=name, context=context)

        messages = [SystemMessage(content=system_prompt)]
        messages.extend(convert_to_messages(history))
        messages.append(HumanMessage(content=question))

        # Fix: handle tool calls manually
        response = llm.invoke(messages, tools=tools)

        if response.tool_calls:
            tool_results = handle_tool_call(response.tool_calls)
            messages.append(response)        # append AI message with tool_calls
            messages.extend(tool_results)    # append ToolMessage results
            response = llm.invoke(messages, tools=tools)  # get final response

        logger.info("LLM response generated successfully")
        return response.content, docs

    except Exception as e:
        logger.error("Error in answer_question: %s", str(e), exc_info=True)
        raise