# Knowledge Base — Bigyan Luitel

## Identity

**Name:** Bigyan Luitel  
**Role:** Computer Science Student & AI Engineer  
**Tagline:** AI Engineer & Backend Developer  
**Primary Interests:** AI Engineering, Backend Development, Retrieval-Augmented Generation, Multi-Agent Systems  
**Goal:** Become an AI Engineer while building strong backend engineering expertise  
**Location:** Kathmandu, Nepal  
**Email:** Luitelbigyan344@gmail.com  
**Phone:** 9840977554  

---

## Education

**Bachelor in Computer Science and Information Technology (2023–2027)**  
Orchid International College, Kathmandu  
Relevant coursework: Data Structures & Algorithms, Database Systems, Statistics & Probability, Networking Fundamentals

**Higher Secondary Certificate (+2)**  
Trinity International College

**Secondary Education Examination (SEE)**  
Tamor Valley Secondary Boarding School — Dhankuta

---

## Biography

Bigyan Luitel is a Computer Science student specializing in AI-powered backend systems and retrieval-augmented generation (RAG) applications. He builds end-to-end Django applications integrated with LangChain, ChromaDB, and large language models. He is a published researcher presenting at SpaceCon 2026 on AI-driven satellite data analysis. His work emphasizes hands-on projects, scalable web architecture, semantic vector pipelines, and intelligent retrieval-based systems. He actively combines coursework with independent experimentation involving large language models, multi-agent orchestration frameworks, and applied data workflows.

---

## Research & Publications

### AI-Powered Satellite Knowledge Assistant
**Venue:** SpaceCon 2026, Kathmandu, Nepal  
**Co-authors:** Anir Jung Thapa (Detech Solution), Sujita Dahal (Orchid International College)

This paper presents AstroQuery, a web-based question-answering system based on a Retrieval-Augmented Generation (RAG) architecture designed for interactive exploration of space research data. The system enables researchers, students, and space enthusiasts to upload satellite datasets (CSV format) and mission documents (PDF format) and query them using a natural-language conversational interface.

**Key results:**
- Overall evaluation score of 0.87 for PDF-based queries
- Overall evaluation score of 0.72 for CSV-based queries
- Average system score of 0.81 across 80 evaluation sessions
- Three real-time evaluation metrics: Retrieval Relevance, Faithfulness, Completeness

**Tech stack:** Django, LangChain, ChromaDB, all-MiniLM-L6-v2 sentence-transformer embeddings, LLaMA 3.3 70B via Groq, pandas, PyPDFLoader

---

## Project Experience

### AstroQuery — AI-Powered Satellite Knowledge Assistant
**Type:** Personal Project / SpaceCon 2026 Research Project  
**Period:** 2025 – 2026

A full-stack Django application integrating LangChain, ChromaDB, and Groq (LLaMA 3.3 70B) to enable natural-language querying over satellite orbital databases and mission documents.

**Technical highlights:**
- Dual ingestion pipelines: PyPDFLoader for PDFs, pandas row-to-text conversion for CSV tabular data
- RecursiveCharacterTextSplitter with chunk size 1,000 characters and overlap of 200 characters
- Semantic retrieval using all-MiniLM-L6-v2 embeddings stored in ChromaDB (cosine similarity, top-4 chunks)
- Stateless multi-turn conversation — history maintained client-side as a JavaScript array, formatted as LangChain HumanMessage/AIMessage objects per request
- Real-time evaluation dashboard measuring Retrieval Relevance (0.79 avg), Faithfulness (0.76 avg), Completeness (0.87 avg)
- Interactive 3D orbit visualizer
- Hallucination prevention via structured system prompt constraining LLM to retrieved context only
- Django session framework used to persist active ChromaDB collection across upload and chat views

**Stack:** Django, LangChain, ChromaDB, all-MiniLM-L6-v2, LLaMA 3.3 70B via Groq, pandas, PyPDFLoader, JavaScript, Python

---

### AI-Assistant Portfolio Website
**Type:** Personal Project  
**Period:** 2025

A RAG-powered portfolio chatbot that answers questions about Bigyan's resume and projects using Groq LLM, Django, and ChromaDB. Features scalable backend APIs, semantic vector retrieval, and context-aware multi-turn conversations. Deployed to Render with a custom .com.np domain configured via Cloudflare DNS.

**Stack:** Django, LangChain, ChromaDB, Groq LLM, Python

---

### AI College Assistant
**Type:** Personal Project  
**Period:** 2024 – 2025

A conversational RAG chatbot that retrieves accurate answers from institutional documents using LangChain orchestration and a local Llama model deployed via Ollama. Features a Streamlit interface for non-technical users.

**Stack:** LangChain, Ollama, Streamlit, Python


### School Management System
**Type:** Academic Project  
**Period:** 2024

A backend-focused Django application managing student records, billing/account tracking, and library issuance. Features full CRUD operations, relational database modeling with MySQL, and a customized admin dashboard.

**Stack:** Django, MySQL, Python

---

## Technical Skills

### Languages
Python, JavaScript, HTML, CSS

### Backend & APIs
Django Framework, REST API Design, CRUD Architecture, API Integration, Authentication Logic, ORM, Model and Relational Design, Template Structuring

### AI & Machine Learning
Retrieval-Augmented Generation (RAG), LangChain Workflows, ChromaDB (Vector Store), Sentence Transformers (all-MiniLM-L6-v2), LLM Deployment via Ollama, Groq LLM (LLaMA 3.3 70B), Prompt Engineering, Prompt Security Testing, Machine Learning Foundations

### RAG Evaluation
Retrieval Relevance, Faithfulness, Completeness metrics; RAGAS framework concepts; annotation-free real-time evaluation design

### Databases
MySQL, ChromaDB, Relational Database Modeling

### Tools & Platforms
Git, Streamlit, Bootstrap, Cloudflare DNS, Render (Deployment), pandas, PyPDFLoader

### CS Foundations
Data Structures & Algorithms, Recursion and Sorting Logic, Statistics & Probability, Networking Fundamentals

---

## Currently Learning

- Multi-agent orchestration frameworks: CrewAI, LangGraph, AutoGen, MCP (Model Context Protocol) — enrolled in a dedicated AI engineering course
- Advancing ML foundations: Pandas, scikit-learn, data analysis workflows
- Agentic AI design patterns: autonomous reasoning, tool use, multi-step workflows

---

## Work Style & Strengths

- Project-driven, implementation-first learner
- Builds intuition through code before deepening theory
- Strong backend + AI integration mindset
- Research-oriented with published work in applied AI
- Comfortable debugging complex systems (import errors, CSRF, JSON serialization, Git history rewriting)
- Able to take a project from idea to deployment end-to-end

---

## Preferred Technology Direction

### Short Term
- Master multi-agent frameworks (CrewAI, LangGraph, AutoGen)
- Deepen RAG system design and evaluation
- Expand Django system complexity and production-readiness

### Long Term
- Transition into an AI Engineer role
- Build production-grade agentic AI applications
- Develop scalable intelligent systems for scientific and enterprise use

---

## Summary

Bigyan Luitel is an AI-focused backend developer and published researcher building hybrid expertise across RAG systems, LLM integration, and scalable Django applications. His portfolio reflects consistent system-building from coursework to conference presentation, applied learning across the full AI engineering stack, and a clear trajectory toward professional AI engineering roles.

