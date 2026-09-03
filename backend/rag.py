from pathlib import Path
from sentence_transformers import SentenceTransformer
import faiss
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=gemini_api_key)

KNOWLEDGE_DIR = Path(__file__).parent/"knowledge"

def load_documents():
    documents = []

    for file_path in KNOWLEDGE_DIR.glob("*.txt"):
        text = file_path.read_text(encoding="utf-8")

        paragraphs = [paragraph.strip() for paragraph in text.split("\n\n") if paragraph.strip()]

        for paragraph in paragraphs:
            documents.append({"text": paragraph, "source": file_path.name})

    return documents

documents = load_documents()

# for document in documents:
#     print(f"\nSOURCE: {document['source']}")
#     print(document['text'])

texts = [document['text'] for document in documents]

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = embedding_model.encode(texts) #creates a 34x384 matrix 

dimension = embeddings.shape[1] #384

index = faiss.IndexFlatL2(dimension) #we need this to perform the search
index.add(embeddings) #adding the matrix to the index, which is actually a numpy array with 34 iterations of 1x384 arrays

#the testing worked, now we actually code the reusability
def generate_answer(query):
    query_embedding = embedding_model.encode(query) 
    query_embedding = query_embedding.reshape(1, dimension) #end of process of making a 1x384 array from the query
    k=3
    distance, indices = index.search(query_embedding, k) #thats cuz this literally returns the distance and the indices, but the distance doesnt seem to bother us

    context = []
    for indice in indices[0]:
        doc = documents[indice]
        context.append(doc['text'])

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
{context}

Student's question:
{query}

Answer:
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text
