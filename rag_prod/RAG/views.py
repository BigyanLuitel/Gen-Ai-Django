import json
import logging

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

logger = logging.getLogger("RAG")


# ---------- page view ----------
@ensure_csrf_cookie
def home(request):
    return render(request, 'core/home.html')


# ---------- chat API ----------
@require_http_methods(["POST"])
def chat_api(request):
    """Accept a JSON POST with { "message": str, "history": list },
    query the ChromaDB vector store via RAG, and return the LLM answer."""
    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, ValueError) as exc:
        logger.warning("Invalid JSON payload: %s", exc)
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    user_message = body.get("message", "").strip()
    if not user_message:
        return JsonResponse({"error": "Message cannot be empty."}, status=400)

    history = body.get("history", [])

    try:
        # Lazy import so the heavy ML libs are only loaded on first request
        from RAG.AI.question_answer import answer_question

        answer, docs = answer_question(user_message, history)

        logger.info("Chat answered — user: %s…", user_message[:60])
        return JsonResponse({
            "reply": answer,
            "sources": [
                {
                    "content": doc.page_content[:200],
                    "metadata": doc.metadata,
                }
                for doc in docs
            ],
        })

    except Exception as exc:
        logger.error("Chat API error: %s", exc, exc_info=True)
        return JsonResponse(
            {"error": "Something went wrong. Please try again."},
            status=500,
        )