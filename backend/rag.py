from pathlib import Path
import json
import numpy as np
import faiss

from google import genai
from google.genai import types
from dotenv import load_dotenv
import os


load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=gemini_api_key)


BACKEND_DIR = Path(__file__).parent

INDEX_PATH = BACKEND_DIR / "faiss_index.bin"
DOCUMENTS_PATH = BACKEND_DIR / "documents.json"


# Load the prebuilt FAISS index
index = faiss.read_index(str(INDEX_PATH))

# Load the documents corresponding to the vectors
with open(DOCUMENTS_PATH, "r", encoding="utf-8") as file:
    documents = json.load(file)


def generate_answer(query):
    # Embed the student's question
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=query,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=768
        )
    )

    query_embedding = np.array(
        result.embeddings[0].values,
        dtype=np.float32
    ).reshape(1, 768)


    # Search the FAISS index
    k = 3

    distance, indices = index.search(query_embedding, k)


    # Retrieve the matching documents
    context = []

    for index_number in indices[0]:
        document = documents[index_number]
        context.append(document["text"])


    context_string = "\n\n".join(context)


    prompt = f"""
You are the AI assistant built into a Student Performance Predictor application.

The application helps students understand factors that can influence
academic performance, including studying, attendance, sleep, tutoring,
and time management.

Your job is to provide helpful and practical guidance to students.

Use the provided context to answer the student's question.

Only use information supported by the provided context.
If the context does not contain enough information to answer the question,
say that you don't have enough information rather than making something up.

Keep your answers clear and reasonably concise.

Do not use Markdown formatting, asterisks, or headings.
Respond in plain text.

Context:
{context_string}

Student's question:
{query}

Answer:
"""


    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text