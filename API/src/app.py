import uuid
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.core.auth import get_current_user, hash, check_hash, create_access_token
from src.database.db import Base, engine, get_db
from src.models.tables import User, Trip, PackingItems, Activity as ActivityModel
from src.models.schema import (
    UserRegister, UserLogin,
    TripSchema, TripUpdateSchema,
    ActivitySchema,
    PackingItem,
)

# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(lifespan=lifespan, title="Traveloop API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROTECTED_FIELDS_TRIP = {"id", "user_id", "share_token", "created_at"}

# ── Auth ──────────────────────────────────────────────────────────────────────

@app.post("/api/auth/register", tags=["Auth"])
async def register(body: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        id=str(uuid.uuid4()),
        name=body.name,
        email=body.email,
        password=hash(body.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@app.post("/api/auth/login", tags=["Auth"])
async def login(body: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if not user or not check_hash(body.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@app.get("/api/auth/me", tags=["Auth"])
async def me(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    user = await db.get(User, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "name": user.name, "email": user.email}


# ── Trips ─────────────────────────────────────────────────────────────────────

@app.get("/api/trips", tags=["Trips"])
async def get_trips(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    result = await db.execute(select(Trip).where(Trip.user_id == current_user))
    trips = result.scalars().all()
    return {
        "trips": [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "cover_photo": t.cover_photo,
                "start_date": str(t.start_date) if t.start_date else None,
                "end_date": str(t.end_date) if t.end_date else None,
                "is_public": t.is_public,
                "share_token": t.share_token,
                "created_at": str(t.created_at) if t.created_at else None,
            }
            for t in trips
        ]
    }


@app.get("/api/trips/{trip_id}", tags=["Trips"])
async def get_trip(
    trip_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    trip = await db.get(Trip, trip_id)
    if not trip or trip.user_id != current_user:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {
        "id": trip.id,
        "title": trip.title,
        "description": trip.description,
        "cover_photo": trip.cover_photo,
        "start_date": str(trip.start_date) if trip.start_date else None,
        "end_date": str(trip.end_date) if trip.end_date else None,
        "is_public": trip.is_public,
        "share_token": trip.share_token,
        "created_at": str(trip.created_at) if trip.created_at else None,
    }


@app.post("/api/trips", tags=["Trips"])
async def create_trip(
    trip: TripSchema,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    new_trip = Trip(
        user_id=current_user,
        title=trip.title,
        description=trip.description,
        cover_photo=trip.cover_photo,
        start_date=trip.start_date,
        end_date=trip.end_date,
        is_public=trip.is_public,
        share_token=str(uuid.uuid4()) if trip.is_public else None,
    )
    db.add(new_trip)
    await db.commit()
    await db.refresh(new_trip)
    return {"message": "Trip created", "trip_id": new_trip.id}


@app.patch("/api/trips/{trip_id}", tags=["Trips"])
async def update_trip(
    trip_id: int,
    updates: TripUpdateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    trip = await db.get(Trip, trip_id)
    if not trip or trip.user_id != current_user:
        raise HTTPException(status_code=404, detail="Trip not found")

    changes = {
        k: v
        for k, v in updates.model_dump(exclude_unset=True).items()
        if k not in PROTECTED_FIELDS_TRIP
    }
    if not changes:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    for field, value in changes.items():
        setattr(trip, field, value)

    # Auto-generate share_token when making public
    if changes.get("is_public") and not trip.share_token:
        trip.share_token = str(uuid.uuid4())

    await db.commit()
    await db.refresh(trip)
    return {"message": "Trip updated", "updated_fields": list(changes.keys())}


@app.delete("/api/trips/{trip_id}", tags=["Trips"])
async def delete_trip(
    trip_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    await db.delete(trip)
    await db.commit()
    return {"message": "Trip deleted"}


# ── Activities ────────────────────────────────────────────────────────────────

@app.get("/api/activities", tags=["Activities"])
async def get_activities(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    result = await db.execute(
        select(ActivityModel).where(ActivityModel.user_id == current_user)
    )
    activities = result.scalars().all()
    return {
        "activities": [
            {"id": a.id, "name": a.name, "cost": a.cost} for a in activities
        ]
    }


@app.post("/api/activities", tags=["Activities"])
async def create_activity(
    activity: ActivitySchema,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    new_activity = ActivityModel(
        user_id=current_user,
        name=activity.name,
        cost=activity.cost or 0.0,
    )
    db.add(new_activity)
    await db.commit()
    await db.refresh(new_activity)
    return {"message": "Activity created", "activity_id": new_activity.id}


@app.delete("/api/activities/{activity_id}", tags=["Activities"])
async def delete_activity(
    activity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    result = await db.execute(
        select(ActivityModel).where(
            ActivityModel.id == activity_id,
            ActivityModel.user_id == current_user,
        )
    )
    activity = result.scalar_one_or_none()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    await db.delete(activity)
    await db.commit()
    return {"message": "Activity deleted"}


# ── Packing Items ─────────────────────────────────────────────────────────────

@app.get("/api/packing", tags=["Packing"])
async def get_packing_items(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    result = await db.execute(
        select(PackingItems).where(PackingItems.user_id == current_user)
    )
    items = result.scalars().all()
    return {
        "items": [
            {"id": i.id, "label": i.label, "category": i.category, "is_packed": i.is_packed}
            for i in items
        ]
    }


@app.post("/api/packing", tags=["Packing"])
async def create_packing_item(
    item: PackingItem,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    new_item = PackingItems(
        user_id=current_user,
        label=item.label,
        category=item.category or "other",
        is_packed=item.is_packed,
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return {"message": "Item created", "item_id": new_item.id}


@app.patch("/api/packing/{item_id}", tags=["Packing"])
async def toggle_packing_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    result = await db.execute(
        select(PackingItems).where(
            PackingItems.id == item_id,
            PackingItems.user_id == current_user,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.is_packed = not item.is_packed
    await db.commit()
    return {"message": "Item updated", "is_packed": item.is_packed}


@app.delete("/api/packing/{item_id}", tags=["Packing"])
async def delete_packing_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    result = await db.execute(
        select(PackingItems).where(
            PackingItems.id == item_id,
            PackingItems.user_id == current_user,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    await db.delete(item)
    await db.commit()
    return {"message": "Item deleted"}


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}
