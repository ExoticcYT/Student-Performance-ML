from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from pathlib import Path
import pandas as pd
from rag import generate_answer

this_file = Path(__file__)
backend_folder = this_file.parent
model_folder = backend_folder/"student_model.pkl"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load(model_folder)

class PredictionRequest(BaseModel):
    Hours_Studied: int
    Attendance: int
    Sleep_Hours: int
    Previous_Scores: int
    Tutoring_Sessions: int
    Physical_Activity: int
    Parental_Involvement: str
    Access_to_Resources: str
    Motivation_Level: str
    Family_Income: str
    Teacher_Quality: str
    Peer_Influence: str
    Parental_Education_Level: str
    Distance_from_Home: str
    Extracurricular_Activities: str
    Internet_Access: str
    School_Type: str
    Learning_Disabilities: str
    Gender: str

@app.post("/predict")
def predict(request: PredictionRequest):
    data = request.model_dump()
    df = pd.DataFrame([data])
    prediction = model.predict(df)[0]
    return {"predicted_exam_score": prediction}

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(request: ChatRequest):
    answer = generate_answer(request.question)
    return {"answer": answer}