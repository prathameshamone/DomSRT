# config.py
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Path to the project root (one level up from this file's folder, i.e. backend/)
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    """
    Centralized application settings, loaded from environment
    variables or a local .env file. This is the single source
    of truth for configuration across the app.
    """

    # --- Google Gemini API ---
    google_api_key: str
    gemini_model: str = "gemini-2.0-flash"

    # --- Supabase ---
    supabase_url: str
    supabase_key: str

    # --- CORS ---
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()