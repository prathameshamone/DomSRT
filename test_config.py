# test_config.py — temporary, delete after confirming it works
from backend.config import settings

print("API key loaded:", bool(settings.google_api_key))  # should print True
print("Model:", settings.gemini_model)
print("CORS origins list:", settings.cors_origins_list)