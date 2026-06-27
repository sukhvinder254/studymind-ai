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
 ✅ Day 2 — Supabase Setup + Backend Server Live

Today was a big day. I set up the entire database on Supabase and got the backend server running for the first time. Created three PostgreSQL tables from scratch — users, pdfs, and chats — using raw SQL in the Supabase
 SQL Editor. Then configured the FastAPI backend with environment variables, CORS middleware, and connected it to Supabase. Wrote the base server file in main.py and tested it locally — the server responded perfectly with a 200 OK. Also added a .gitignore file to make sure sensitive files like .env never get pushed to GitHub. Small but solid progress every single day.

*More updates coming daily... 🚀*
✅ Day 3 — Auth API with Signup & Login

Today I built the complete authentication system for the backend. Created a routes folder inside backend and wrote auth.py with two API endpoints — POST /auth/signup and POST /auth/login. The signup endpoint checks if the email already exists in the database, hashes the password securely using bcrypt, and saves the user to Supabase. The login endpoint verifies the email and password, then returns a JWT token for secure sessions.

**Errors I faced and how I solved them:**

The first error was `SupabaseException: Invalid URL` — I had accidentally pasted the dashboard URL instead of the actual project URL in my .env file. Fixed it by using the correct `https://xftztahwrptoyhwdsevj.supabase.co` format.

The second error was `bcrypt: no backends available` — passlib was not finding bcrypt properly. I uninstalled passlib and reinstalled it with `pip install passlib[bcrypt]`, but the issue persisted. Finally switched to using the bcrypt library directly instead of passlib, which fixed it completely.

The third error was `ValueError: password cannot be longer than 72 bytes` — bcrypt has a 72 character limit. Fixed by truncating the password with `data.password[:72]` before hashing.

After fixing all three errors, tested the signup API on Swagger UI at `/docs` and got a `200 OK` response with `Signup successful!`. Checked Supabase Table Editor and saw the user saved in the database with a properly hashed password — that moment felt really satisfying.

*More updates coming daily... 🚀*
 ✅ Day 4 — PDF Upload + Gemini AI Chat API

Today was the most exciting day so far — I integrated Google Gemini AI into the backend. Created two new route files — pdf.py and chat.py inside the routes folder.

The PDF upload endpoint reads the uploaded file, extracts all the text from every page using pdfplumber, and saves both the filename and the extracted text into the Supabase pdfs table. This text is what the AI will later use to answer questions.

The chat endpoint takes the user's question, fetches the relevant PDF text from the database, builds a prompt combining both the PDF content and the question, sends it to Google Gemini 1.5 Flash, and returns the AI's response. Every conversation is also saved in the chats table so history is maintained.

Also updated main.py to include all three routers — auth, pdf, and chat — so the entire backend is now connected and running as one unified API server.

Tested on Swagger UI at /docs and all 6 endpoints are showing up and working perfectly:
- POST /auth/signup
- POST /auth/login
- POST /pdf/upload
- GET /pdf/list
- POST /chat/message
- GET /

The backend is now fully functional. Next up — building the React frontend!

*More updates coming daily... 🚀*
