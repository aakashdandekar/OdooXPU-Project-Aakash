from datetime import date
from sqlalchemy import String, Float, DateTime, func, Date, ForeignKey, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database.db import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), unique=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    trip: Mapped[list["Trip"]] = relationship(back_populates="users")
    activities: Mapped[list["Activity"]] = relationship(back_populates="users")
    packages: Mapped[list["PackingItems"]] = relationship(back_populates="users")

    restaurant_preferences: Mapped["RestaurantPreference"] = relationship(back_populates="users")

class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(100), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=True)
    travellers: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    share_token: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    created_at: Mapped[DateTime] = mapped_column(Date, nullable=False)

    user: Mapped["User"] = relationship(back_populates="trips")

class PackingItems(Base):
    __tablename__ = "packingitems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(100), ForeignKey("users.id"), nullable=False)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(255), default="others", nullable=False)
    is_packed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user: Mapped["User"] = relationship(back_populates="packingitems")

class Activity(Base):
    __tablename__ = "activity"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(100), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    cost: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    user: Mapped["User"] = relationship(back_populates="activity")

class RestaurantPreference(Base):
    __tablename__ = "restaurant-preference"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(100), ForeignKey("user.id"))
    star: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    precision: Mapped[int] = mapped_column(Boolean, nullable=False, default=False)

    user: Mapped["User"] = relationship(back_populates="restaurant-preferences")

class TransportPreference(Base):
    __tablename__ = "trasport-preferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(100), ForeignKey("users.id"), nullable=False)
    budget: Mapped[float] = mapped_column(Float, nullable=False, default=5000.0)

    user: Mapped["User"] = relationship(back_populates="transport-prefernces")

class HotelPreferences(Base):
    __tablename__ = "hotel-preferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(100), ForeignKey("users.id"), nullable=False)
    budget: Mapped[float] = mapped_column(Float, nullable=False, default=5000.0)

    user: Mapped["User"] = relationship(back_populates="hotel-preferences")