import google.generativeai as genai
import os
import json
from datetime import timedelta

# Configure the SDK
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def setup_gemini_persona():
    """
    Initializes the Gemini 1.5 model with a strict Persona and JSON mode.
    """
    system_instruction = (
        "You are the VenueFlow AI Architect. Your expertise is in real-time crowd "
        "analytics and venue safety. You communicate only through structured data. "
        "Always output JSON. Never use natural language outside the JSON block."
    )

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system_instruction
    )
    
    return model

def analyze_venue_frame(prompt: str):
    model = setup_gemini_persona()
    
    # Implementing Constrained Output (JSON Mode)
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
        )
    )
    
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {"error": "Malformed AI response", "raw": response.text}

def implement_context_caching(corpus_text: str):
    """
    Example of implementing Context Caching for large, static datasets
    (e.g., Venue Safety manuals or Historical Crowd Data).
    """
    # Note: Context Caching is currently available in the Vertex AI SDK 
    # and the Generative AI v1beta API.
    
    # 1. Create a cache for the static context
    # cache = genai.CachingService.create(
    #     model="models/gemini-1.5-flash-001",
    #     display_name="venue-safety-manual",
    #     contents=[corpus_text],
    #     ttl=timedelta(hours=24)
    # )
    
    # 2. Use the cache in subsequent calls to save tokens
    # response = model.generate_content("Analyze this frame based on the manual", cache=cache.name)
    pass

# Suggested Caching Method:
# For the 'VenueFlow AI' app, you should cache the 'System Instruction' and 
# any 'Frequently Asked Questions' data using Gemini's Context Caching.
# This ensures that every user query doesn't re-process the massive architect persona
# and reference manuals, lowering costs by up to 90% for long-context tasks.
