from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.auth import router as auth_router
from routes.pdf import router as pdf_router
from routes.chat import router as chat_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(pdf_router, prefix="/pdf")
app.include_router(chat_router, prefix="/chat")

@app.get("/")
def root():
    return {"message": "StudyMind AI Backend Running!"}
