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
    contents = f"Context:\n{context_string}\n\nQuestion:\n{query}\n\nAnswer the question using the provided context."

    response = client.models.generate_content(
        model="gemini-3.7-flash",
        contents=contents
    )

    return response.text
