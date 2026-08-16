# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routes import router

app = FastAPI(title="DomSRT Chatbot API")

# --- CORS ---
# Allows your frontend (running on a different origin/port) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes ---
app.include_router(router)


@app.get("/")
def health_check():
    """Simple endpoint to confirm the API is alive."""
    return {"status": "ok", "service": "DomSRT Chatbot API"}