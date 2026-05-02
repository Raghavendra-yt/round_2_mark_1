import redis
import json
import hashlib
from typing import Optional

# Redis Connection Setup
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def get_gemini_response(prompt: str) -> Optional[dict]:
    """
    Fetches response from Redis cache if available, otherwise returns None.
    Uses SHA256 hash of the prompt as the cache key.
    """
    cache_key = f"gemini:{hashlib.sha256(prompt.encode()).hexdigest()}"
    cached_data = redis_client.get(cache_key)
    
    if cached_data:
        return json.loads(cached_data)
    return None

def set_gemini_response(prompt: str, response_data: dict, ttl: int = 3600):
    """
    Caches a Gemini response with a specific Time-To-Live (TTL).
    """
    cache_key = f"gemini:{hashlib.sha256(prompt.encode()).hexdigest()}"
    redis_client.setex(
        cache_key,
        ttl,
        json.dumps(response_data)
    )

# FastAPI Integration Example:
# @app.post("/gemini")
# async def gemini_proxy(payload: dict):
#     prompt = payload.get("prompt")
#     cached = get_gemini_response(prompt)
#     if cached:
#         return {"source": "cache", "data": cached}
#     
#     # Call actual Gemini API here...
#     response = call_real_gemini(prompt)
#     
#     set_gemini_response(prompt, response)
#     return {"source": "api", "data": response}
