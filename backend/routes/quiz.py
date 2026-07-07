from fastapi import APIRouter
from pydantic import BaseModel
from supabase import create_client
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

class QuizRequest(BaseModel):
    pdf_id: str

@router.post("/generate")
def generate_quiz(data: QuizRequest):
    pdf = supabase.table("pdfs").select("*").eq("id", data.pdf_id).execute()
    if not pdf.data:
        return {"error": "PDF not found"}
    pdf_text = pdf.data[0]["pdf_text"]
    prompt = f"""
    Based on this PDF content, generate 5 multiple choice questions.
    Return ONLY a valid JSON array, no extra text, no markdown.
    Each question must have exactly 4 options as full sentences.
    The answer field must exactly match one of the options word for word.
    Format:
    [
      {{
        "question": "Question here?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "answer": "Option 1"
      }}
    ]
    PDF Content: {pdf_text[:3000]}
    """
    response = model.generate_content(prompt)
    text = response.text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    questions = json.loads(text)
    return {"questions": questions}
