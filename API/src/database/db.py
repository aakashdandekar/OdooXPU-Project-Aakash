from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URI = os.getenv("DATABASE_URI", "sqlite+aiosqlite:///./traveloop.db")

engine = create_async_engine(
    DATABASE_URI,
    echo=os.getenv("DB_ECHO", "false").lower() == "true",
    # SQLite doesn't support pool_size/max_overflow
    **({} if "sqlite" in DATABASE_URI else {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,
    })
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
