# Gen-Ai-Django

AI-powered Django resume portfolio with a Retrieval-Augmented Generation (RAG) chatbot.

This project serves a personal portfolio page and exposes a chat endpoint that answers questions grounded in a local Markdown knowledge base using LangChain, ChromaDB, sentence-transformer embeddings, and Groq-hosted LLMs.

## What This Project Does

- Renders a portfolio/resume web page at `/`
- Provides a chatbot UI on the same page
- Sends chat messages to a Django API endpoint: `/api/chat/`
- Retrieves relevant chunks from a local vector store
- Generates grounded responses with an LLM (Groq)

## Tech Stack

- Backend: Django 6
- AI orchestration: LangChain
- Embeddings: `sentence-transformers/all-MiniLM-L6-v2`
- Vector database: Chroma (persistent local store)
- LLM provider: Groq via `langchain-groq`
- Deployment: Render + Gunicorn + WhiteNoise

## Project Structure

```text
Gen-Ai-Django/
├─ README.md
├─ render.yaml
└─ rag_prod/
	 ├─ manage.py
	 ├─ requirements.txt
	 ├─ build.sh
	 ├─ rag_prod/
	 │  ├─ settings.py
	 │  └─ urls.py
	 └─ RAG/
			├─ views.py
			├─ AI/
			│  ├─ ingest.py
			│  ├─ question_answer.py
			│  └─ knowledge-base/
			│     └─ bigyan_knowledge_base.md
			├─ templates/core/home.html
			├─ templates/static/JS/home.js
			├─ templates/static/CSS/home.css
			└─ vector_db/
```

## How It Works

1. User opens the portfolio at `/`.
2. Frontend JavaScript posts `{ message, history }` to `/api/chat/`.
3. Django `chat_api` validates JSON and lazy-loads the RAG module.
4. Retriever queries Chroma for top-k relevant chunks.
5. Retrieved text is injected into a strict system prompt.
6. Groq model returns an answer.
7. API responds with:
	 - `reply`: assistant answer text
	 - `sources`: short content preview + metadata for retrieved chunks

## Local Setup

### 1. Prerequisites

- Python 3.12+ recommended
- `pip`
- Internet access for first-time model/embedding downloads

### 2. Create and activate virtual environment

From the repository root:

```powershell
cd rag_prod
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
pip install --upgrade pip
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
```

### 4. Configure environment variables

Create `rag_prod/.env` and set:

```env
SECRET_KEY=your-django-secret
DEBUG=True
GROQ_API_KEY=your-groq-api-key
MODEL_NAME=llama-3.3-70b-versatile
```

Optional variables:

```env
DATABASE_URL=sqlite:///db.sqlite3
RENDER_EXTERNAL_HOSTNAME=your-render-hostname.onrender.com
```

### 5. Build or rebuild vector database (important)

Run ingestion whenever you update files in `RAG/AI/knowledge-base/`:

```powershell
python RAG/AI/ingest.py
```

### 6. Run migrations and start server

```powershell
python manage.py migrate
python manage.py runserver
```

App URL: `http://127.0.0.1:8000/`

## API Reference

### POST `/api/chat/`

Request body:

```json
{
	"message": "Tell me about Bigyan's backend experience",
	"history": [
		{ "role": "user", "content": "Who is Bigyan?" },
		{ "role": "assistant", "content": "..." }
	]
}
```

Success response:

```json
{
	"reply": "Bigyan has practical Django backend experience...",
	"sources": [
		{
			"content": "...chunk preview...",
			"metadata": {
				"source": "...",
				"doc_type": "bigyan_knowledge_base"
			}
		}
	]
}
```

Common error responses:

- `400` when JSON is invalid or `message` is empty
- `500` when retrieval/model invocation fails

## Deployment (Render)

This repository includes `render.yaml` using:

- Root directory: `rag_prod`
- Build command: `./build.sh`
- Start command: `gunicorn rag_prod.wsgi:application --timeout 120`

`build.sh` performs:

1. `pip install --upgrade pip`
2. CPU-only PyTorch install
3. `pip install -r requirements.txt`
4. `python manage.py collectstatic --no-input`
5. `python manage.py migrate`

Set these Render environment variables:

- `SECRET_KEY`
- `GROQ_API_KEY`
- `DEBUG=False`
- `PYTHON_VERSION=3.12.3`

Recommended:

- Use persistent storage or external DB if you need durable data beyond redeploy cycles.

## Updating Knowledge Base

1. Add or edit Markdown files in `rag_prod/RAG/AI/knowledge-base/`.
2. Re-run ingestion:

```powershell
python RAG/AI/ingest.py
```

3. Restart the Django server.

## Troubleshooting

- Chat returns generic server error:
	- Verify `GROQ_API_KEY` is set correctly.
	- Check that vector DB exists and ingestion was run.
- First run is slow:
	- Expected while downloading embedding/model dependencies.
- Empty or weak answers:
	- Improve the Markdown knowledge base content and re-ingest.

## Current Gaps

- Automated tests are not implemented yet (`RAG/tests.py` is a stub).
- AI prompt and knowledge base are portfolio-specific.

## License

No license file is currently included in this repository.
