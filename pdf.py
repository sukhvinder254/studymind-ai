from fastapi import APIRouter, UploadFile, File, Form
from supabase import create_client
import pdfplumber
import io
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), user_id: str = Form(...)):
    contents = await file.read()
    text = ""
    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    result = supabase.table("pdfs").insert({
        "user_id": user_id,
        "filename": file.filename,
        "pdf_text": text
    }).execute()
    return {"message": "PDF uploaded!", "pdf_id": result.data[0]["id"]}

@router.get("/list")
def list_pdfs(user_id: str):
    result = supabase.table("pdfs").select("*").eq("user_id", user_id).execute()
    return result.data
@router.delete("/delete/{pdf_id}")
def delete_pdf(pdf_id: str):
    supabase.table("chats").delete().eq("pdf_id", pdf_id).execute()
    supabase.table("pdfs").delete().eq("id", pdf_id).execute()
    return {"message": "PDF deleted!"}
