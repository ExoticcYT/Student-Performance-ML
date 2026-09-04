# WhatYouGonnaGet.com

A full-stack machine learning application that predicts student exam scores and provides an AI-powered study assistant using Retrieval-Augmented Generation (RAG).

## Live Demo

https://frontend-whatyougonnaget.onrender.com/

## Overview

WhatYouGonnaGet.com combines a machine learning prediction system with an AI study assistant to help students better understand factors that can influence academic performance.

The application consists of two main components:

- A student exam score predictor powered by scikit-learn
- An AI study assistant powered by RAG, FAISS, Gemini embeddings, and an LLM

## Features

### Student Performance Predictor

- Predicts a student's expected exam score based on academic and lifestyle factors
- Uses a scikit-learn regression pipeline
- Handles both numerical and categorical features
- FastAPI backend for serving predictions
- Next.js and React frontend for user interaction

### AI Study Assistant

- Uses Retrieval-Augmented Generation (RAG) to provide knowledge-grounded responses
- Converts knowledge-base content into embedding vectors using Gemini
- Uses FAISS for semantic similarity search
- Retrieves relevant information before generating a response
- Uses the Gemini API to generate the final answer
- Restricts responses to information supported by the application's knowledge base

## How It Works

### Machine Learning Pipeline

```text
User Input
    ↓
Next.js Frontend
    ↓
FastAPI Backend
    ↓
scikit-learn Model
    ↓
Predicted Exam Score
```

The prediction model was trained on a public student performance dataset and uses factors including study time, attendance, sleep, previous scores, tutoring, physical activity, and other student characteristics.

### RAG Pipeline

```text
Student Question
    ↓
Gemini Embedding
    ↓
FAISS Similarity Search
    ↓
Relevant Knowledge
    ↓
Gemini
    ↓
Generated Answer
```

The RAG system first converts the student's question into an embedding vector. FAISS then searches the knowledge base for the most semantically similar information. The retrieved context is provided to Gemini, which generates a concise response based on that information.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- scikit-learn
- pandas
- joblib

### AI / RAG

- Gemini API
- Gemini Embeddings
- FAISS
- Retrieval-Augmented Generation (RAG)

### Deployment

- Render
- GitHub

## Memory Optimization

The RAG system was optimized for deployment in a memory-constrained environment.

The initial implementation used a SentenceTransformer model at runtime to generate embeddings. This resulted in approximately 605 MB of runtime memory usage, which exceeded the available memory for the deployment environment.

The system was redesigned to use Gemini embeddings for the knowledge base, eliminating the need to load a SentenceTransformer model at runtime. FAISS stores the resulting embedding vectors and performs similarity searches at runtime.

This reduced the measured runtime memory usage from approximately 605 MB to approximately 93 MB.

## Project Structure

```text
student-score-predictor/
├── backend/
│   ├── knowledge/
│   ├── main.py
│   ├── rag.py
│   ├── student_model.pkl
│   └── requirements.txt
│
└── frontend/
    ├── app/
    ├── public/
    ├── package.json
    └── ...
```

## Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```text
GEMINI_API_KEY=your_api_key_here
```

Run the backend:

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
```

For local development, create a `.env.local` file in `frontend/`:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Run the frontend:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Deployment

The frontend and backend are deployed separately using Render.

For the deployed frontend, the `NEXT_PUBLIC_API_URL` environment variable is configured directly through Render.

The Gemini API key is stored as a backend environment variable and is not included in the repository.
