import os
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi.security import HTTPBearer
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from dotenv import load_dotenv
from src.database.db import get_db
from src.models.schema import UserModel

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "dev_fallback_key")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def hash(password: str) -> str:
    return pwd_context.hash(password)


def check_hash(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_access_token(user_id: str) -> str:
    return jwt.encode({
        "user_id": user_id,
        "exp": datetime.now(tz=timezone.utc) + timedelta(hours=72)
    }, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token=Depends(security),
    db: AsyncSession = Depends(get_db)
) -> UserModel:
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str= payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user.id
