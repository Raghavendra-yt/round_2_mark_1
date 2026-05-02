from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
from typing import List, Optional
import google.generativeai as genai

# Load Environment Variables
# In production, these should be set in the environment
GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY", "your_api_key_here")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="VenueFlow AI Backend")

/**
 * CORS Synchronization
 * Ensures frontend and backend can communicate across different ports.
 */
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "https://elected-app.run.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Contract Definitions (Shared with Frontend)
class GeminiResponse(BaseModel):
    prediction: str
    confidence: float
    recommendations: List[str]

class PredictionRequest(BaseModel):
    prompt: str

@app.post("/api/predict", response_model=GeminiResponse)
async def predict(request: PredictionRequest):
    """
    Unified entry point for Gemini predictions.
    Implements strict error propagation for the frontend to catch.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        # Using JSON mode for constrained output
        response = model.generate_content(
            request.prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        
        # Parse and return (FastAPI handles serialization)
        import json
        return json.loads(response.text)
        
    except Exception as e:
        # Propagation Strategy: Raise 500 with descriptive message for UI Toasts
        print(f"Backend Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
