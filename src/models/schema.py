from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ── Preference ──────────────────────────────────────────────────────────────────────

class Transport(BaseModel):
    id: int = None
    user_id: str
    mode_transport: str = ""
    budget: int|float

class Hotels(BaseModel):
    id: int = None
    user_id: str
    area_requirements: str = None
    with_Restaurant: bool = False
    budget: int|float = float('inf')

class Restaurant(BaseModel):
    id: int = None
    user_id: str
    star: int = 0

# ── Activity ──────────────────────────────────────────────────────────────────

class Activity(BaseModel):
    id: Optional[int] = None
    name: str
    cost: Optional[float] = None
    activity_type: Optional[str] = None    # e.g. "sightseeing", "food"

    model_config = {"from_attributes": True}


# ── Trip Stop ─────────────────────────────────────────────────────────────────

class TripStop(BaseModel):
    id: Optional[int] = None
    city_name: str
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    sort_order: int = 0
    activities: List[Activity] = []

    model_config = {"from_attributes": True}


# ── Trip ──────────────────────────────────────────────────────────────────────

class TripSchema(BaseModel):
    id: int = None        # frontend doesn't send this
    user_id: str
    title: str                       # required
    description: Optional[str] = None
    cover_photo: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_public: bool = False
    share_token: Optional[str] = None   # set on publish
    created_at: Optional[datetime]  # set by DB
    stops: List[TripStop] = []
    model_config = {"from_attributes": True}

# ── Trip Update ───────────────────────────────────────────────────────────────

class TripUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_photo: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_public: Optional[bool] = None

# ── Packing ───────────────────────────────────────────────────────────────────

class PackingItem(BaseModel):
    id: Optional[int] = None
    label: str
    category: Optional[str] = "other"     # clothing, documents, electronics, other
    is_packed: bool = False
    model_config = {"from_attributes": True}


# ── User ──────────────────────────────────────────────────────────────────────
class UserModel(BaseModel):
    id: str
    name: str
    email: EmailStr
    my_trips: List[TripSchema] = []
    my_preferences: List[Transport, Hotels, Restaurant] = None
    password: str