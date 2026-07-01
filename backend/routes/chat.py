from fastapi import APIRouter
from pydantic import BaseModel
from supabase import create_client
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

class ChatRequest(BaseModel):
    user_id: str
    pdf_id: str
    message: str

@router.post("/message")
def chat(data: ChatRequest):
    pdf = supabase.table("pdfs").select("*").eq("id", data.pdf_id).execute()
    if not pdf.data:
        return {"error": "PDF not found"}
    pdf_text = pdf.data[0]["pdf_text"][:1000]
    prompt = f"""
    PDF Content: {pdf_text[:1000]}
    
    User Question: {data.message}
    
    Answer the question based on the PDF content only.
    """
    response = model.generate_content(prompt)
    supabase.table("chats").insert({
        "user_id": data.user_id,
        "pdf_id": data.pdf_id,
        "message": data.message,
        "response": response.text
    }).execute()
    return {"response": response.text}
