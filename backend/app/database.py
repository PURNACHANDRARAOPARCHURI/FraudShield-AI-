import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

logger = logging.getLogger("fraudshield.database")

Base = declarative_base()

def get_engine():
    # Attempt Postgres connection
    try:
        engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
        # Test connection
        with engine.connect() as conn:
            logger.info("Connected successfully to PostgreSQL database!")
        return engine
    except Exception as e:
        logger.warning(f"PostgreSQL connection failed ({e}). Falling back to SQLite database ({settings.SQLITE_FALLBACK_URL}).")
        sqlite_engine = create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )
        return sqlite_engine

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
