from datetime import date
from sqlalchemy import String, Float, DateTime, func, Date, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database.db import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(255), primary_key=True, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), unique=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    trip: Mapped[list["Trip"]] = relationship(back_populates="trips")
    activities: Mapped[list["Activity"]] = relationship(back_populates="activity")
    packages: Mapped[list["PackingItems"]] = relationship(back_populates="packageitems")

class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, unique=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(100), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    share_token: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    created_at: Mapped[DateTime] = mapped_column(Date, nullable=False)

    user: Mapped[list["User"]] = relationship(back_populates="users")

class PackingItems(Base):
    __tablename__ = "packingitems"

    id: Mapped[str] = mapped_column(String(100), nullable=False, primary_key=True)
    user_id: Mapped[str] = mapped_column(String(100), ForeignKey("users.id"), nullable=False)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(255), default="others", nullable=False)
    is_packed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user: Mapped[list["User"]] = relationship(back_populates="users")

class Activity(Base):
    __tablename__ = "activity"

    id: Mapped[str] = mapped_column(String(100), nullable=False)
    user_id: Mapped[str] = mapped_column(String(100), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    cost: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    user: Mapped[list["User"]] = relationship(back_populates="users")

class Preferences(Base):
    __tablename__ = ""