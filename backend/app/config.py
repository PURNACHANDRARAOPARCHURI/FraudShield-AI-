import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise AI Fraud Detection System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgrel:6304990878purna@localhost:5432/BankFraudSystem"
    )
    SQLITE_FALLBACK_URL: str = "sqlite:///./bank_fraud.db"
    
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Threshold defaults
    INITIAL_APPROVAL_THRESHOLD: float = 0.40
    HIGH_RISK_HUMAN_REVIEW_THRESHOLD: float = 0.75

    class Config:
        case_sensitive = True

settings = Settings()
