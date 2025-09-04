from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FAS-MBBS"
    DATABASE_URL: str = "sqlite:///./fas_mbbs.db"
    SECRET_KEY: str = "your_secret_key_here_make_it_very_long_and_random"
    OPENAI_API_KEY: Optional[str] = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    class Config:
        env_file = ".env"

settings = Settings()
