from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URI: str = "sqlite+aiosqlite:///./traveloop.db"
    DB_ECHO: bool = False
    SECRET_KEY: str = "dev_fallback_key"
    GEMINI_API_KEY: Optional[str] = None
    GOOGLE_MAPS_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"   # ignore unknown vars like DB_HOST, DB_PORT etc.

settings = Settings()
