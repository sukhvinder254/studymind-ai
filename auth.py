from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client
import bcrypt
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
SECRET_KEY = os.getenv("SECRET_KEY")

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: SignupRequest):
    existing = supabase.table("users").select("*").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    supabase.table("users").insert({
        "name": data.name,
        "email": data.email,
        "password": hashed
    }).execute()
    return {"message": "Signup successful!"}

@router.post("/login")
def login(data: LoginRequest):
    user = supabase.table("users").select("*").eq("email", data.email).execute()
    if not user.data:
        raise HTTPException(status_code=400, detail="User not found")
    if not bcrypt.checkpw(data.password.encode('utf-8'), user.data[0]["password"].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Wrong password")
    token = jwt.encode({"id": user.data[0]["id"], "email": data.email}, SECRET_KEY)
    return {
        "token": token,
        "name": user.data[0]["name"],
        "id": user.data[0]["id"]
    }
