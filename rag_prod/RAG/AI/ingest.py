import os
import glob
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface  import HuggingFaceEmbeddings

DB_NAME = str(Path(__file__).parent.parent/"vector_db")
KNOWLEDGE_PATH = Path(__file__).parent / "knowledge-base"

load_dotenv(override=True)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def fetch_documents():
    Loader = DirectoryLoader(
        KNOWLEDGE_PATH, 
        glob="**/*.md", 
        loader_cls=TextLoader, 
        loader_kwargs={"encoding": "utf-8"}
    )
    documents = Loader.load()
    
    for doc in documents:
        filename = os.path.basename(doc.metadata.get("source", ""))
        doc.metadata["doc_type"] = filename.replace(".md", "")
    return documents

def create_chunks(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n## ", "\n### ", "\n---", "\n\n", "\n", " "],
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks from {len(documents)} document(s).")
    for i, chunk in enumerate(chunks):
        print(f"  Chunk {i}: {len(chunk.page_content)} chars — {chunk.page_content[:80]}...")
    return chunks

def create_embeddings(chunks):
    if os.path.exists(DB_NAME):
        db = Chroma(persist_directory=DB_NAME, embedding_function=embeddings)
        db.delete_collection()
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=DB_NAME
    )
    collection = vector_store._collection
    count = collection.count()
    sample_embeddings = collection.get(limit=1, include=["embeddings"])["embeddings"][0]
    dimension = len(sample_embeddings)
    print(f"Created vector store with {count} embeddings of dimension {dimension}.")
    return vector_store

if __name__ == "__main__":
    documents = fetch_documents()
    chunks = create_chunks(documents)
    create_embeddings(chunks)
    print("Ingestion complete.")
