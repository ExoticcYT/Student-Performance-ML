from pathlib import Path
from sentence_transformers import SentenceTransformer
import faiss

KNOWLEDGE_DIR = Path("knowledge")

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

#just a test here
query = "How can sleep affect my studying?"
query_embedding = embedding_model.encode(query) 
query_embedding = query_embedding.reshape(1, dimension) #end of process of making a 1x384 array from the query
k=3
distance, indices = index.search(query_embedding, k) #thats cuz this literally returns the distance and the indices, but the distance doesnt seem to bother us

context = []
for indice in indices[0]:
    doc = documents[indice]
    context.append(doc['text'])

context_string = "\n\n".join(context)
