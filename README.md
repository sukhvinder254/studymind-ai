#  StudyMind AI

Ever wished you had a personal tutor who actually read your notes? That's exactly what I built. StudyMind AI lets you upload your PDF notes and chat with them using Google Gemini AI — like having a real conversation with your own study material.

## Why I Built This

As a first-year CS student, I always struggled with going through long PDF notes before exams. There are so many topics, so many chapters — and so little time. One day I thought, what if I could just *ask* my notes a question and get a proper answer instantly? No scrolling, no searching, just a simple chat. So I decided to build it myself instead of waiting for someone else to.

##  Features

-  Upload your PDF notes
-  Chat with AI about anything in your notes
-  Secure login and signup system
-  Chat history saved automatically
-  Clean and responsive UI

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini API |
| Hosting | Vercel + Render |

##  Live Demo

Coming soon...


##  How to Run Locally

```bash
git clone https://github.com/sukhvinder254/studymind-ai.git
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ../frontend
npm install
npm run dev
Development Journey
✅ Day 1 — Project Setup
Today was all about setting the foundation. I started by creating the GitHub repository and cloning it locally in VS Code. Then I created two separate folders — frontend for the React app and backend for the FastAPI server. Inside the backend, I set up a Python virtual environment and installed all the required libraries including FastAPI, Uvicorn, Supabase, pdfplumber, Google Generative AI, and authentication libraries like python-jose and passlib. I also created the main.py and .env files to get the backend structure ready. Finally pushed everything to GitHub. Small start, but the foundation is solid.
More updates coming daily as I keep building... 🚀
