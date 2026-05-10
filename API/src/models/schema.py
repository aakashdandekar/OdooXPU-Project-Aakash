from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from typing import Union


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
    id: Optional[int] = None    # fix
    user_id: str
    mode_transport: str = ""
    budget: Optional[float] = None    # None = no budget limit

class Hotels(BaseModel):
    id: Optional[int] = None    # fix
    user_id: str
    area_requirements: str = None
    with_Restaurant: bool = False
    budget: Optional[float] = None    # None = no budget limit

class Restaurant(BaseModel):
    id: Optional[int] = None    # fix
    user_id: str
    star: int = 0

# ── Activity ──────────────────────────────────────────────────────────────────

class ActivitySchema(BaseModel):
    id: Optional[int] = None
    name: str
    cost: Optional[float] = None

    model_config = {"from_attributes": True}


# ── Trip Stop ─────────────────────────────────────────────────────────────────

class TripStop(BaseModel):
    id: Optional[int] = None
    city_name: str
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    sort_order: int = 0
    activities: List[ActivitySchema] = []

    model_config = {"from_attributes": True}


# ── Trip ──────────────────────────────────────────────────────────────────────

class TripSchema(BaseModel):
    id: Optional[int] = None
    title: str                       # required
    description: Optional[str] = None
    cover_photo: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_public: bool = False
    share_token: Optional[str] = None   # set on publish
    created_at: Optional[datetime] = None  # set by DB
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
    my_preferences: Optional[List[Union[Transport, Hotels, Restaurant]]] = None