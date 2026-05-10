from fastapi import FastAPI , HTTPException, Depends, Form
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.core.auth import get_current_user
from src.database.db import Base, engine, get_db
from src.services.helpers import Chatbot
from typing import Any
from src.models.tables import User, Trip, PackingItems, Activity as ActivityModel, TripStop
from src.models.schema import TripSchema, TripUpdateSchema, ActivitySchema as Activity, PackingItem, UserProfile
import secrets


# ================================================================================
# Config
# ================================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    await engine.dispose()

app = FastAPI(
    lifespan=lifespan
)

PROTECTED_FIELDS_TRIP = {"id", "user_id", "share_token", "created_at"}

# ================================================================================
# Endpoints
# ================================================================================

#Aakash Domain
@app.patch('/api/update/profile')
async def update_profile(
    data: UserProfile,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        user = await db.get(User, current_user)
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(user, field, value)

        await db.commit()
        await db.refresh()

        return {"message": "profile has been update!"}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error {e} occurred while updating profile.")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
@app.get('/api/profile')
async def get_profile(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        user = await db.get(User, current_user)
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        
        return {"message": user}

    except Exception as e:
        print(f"Error {e} occurred while fetching profile for user {current_user}")

@app.post('/api/itinerary/generate')
async def itinerary_generation(
    data: Any,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        user = await db.get(User, current_user)
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        
        bot = Chatbot(data)
        response = bot.responseModel("Generate day by day itinary based on data")

        return {"message": response}

    except HTTPException:
        raise
    except Exception as e:
        print(f'Error {e} occurred while generating itinerary')
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@app.post('/api/chatbot')
async def get_chatbot(
    data: Any = Form(...),
    query: str = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        user = await db.get(User, current_user)
        if not user:
            raise HTTPException(status_code=400, detail="User does not exist")
        
        bot = Chatbot(data)
        response = bot.responseModel(query)

        return {"message": response}
    
    except Exception as e:
        print(f"Error {e} occurred during {current_user} interacted with chatbot.")

@app.post('/api/create/trip')
async def create_trip(
    trip: TripSchema,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        user = await db.get(User, current_user)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        new_trip = Trip(
            **trip.model_dump(exclude_none=True, exclude={"stops", "id"}),
            user_id=current_user
        )
        db.add(new_trip)
        await db.commit()
        await db.refresh(new_trip)

        return {"message": "Trip created", "trip_id": new_trip.id}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error {e} raised when {current_user} tried to create trip")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    

#Shyam Domain
@app.patch('/api/update/trip/{trip_id}')
async def update_trip(
    trip_id: str,
    updates: TripUpdateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        user = await db.get(User, current_user)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        trip = await db.get(Trip, trip_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        if trip.user_id != current_user:
            raise HTTPException(status_code=403, detail="Not authorized")

        # only fields user actually sent, minus protected ones
        changes = {
            k: v for k, v in updates.model_dump(exclude_unset=True).items()
            if k not in PROTECTED_FIELDS_TRIP
        }

        if not changes:
            raise HTTPException(status_code=400, detail="No valid fields to update")

        for field, value in changes.items():
            setattr(trip, field, value)

        await db.commit()
        await db.refresh(trip)

        return {"message": "Trip updated", "updated_fields": list(changes.keys())}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error {e} raised when {current_user} tried to update trip {trip_id}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")



@app.delete('/api/delete/trip/{trip_id}')
async def delete_trip(
    trip_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        user = await db.get(User, current_user)
        if not user:
            raise HTTPException(status_code=400, detail="User not found")

        result = await db.execute(
            select(Trip).where(
                Trip.id == trip_id,
                Trip.user_id == current_user
            )
        )
        trip = result.scalar_one_or_none()

        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        await db.delete(trip)
        await db.commit()

        return {"message": "Trip deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error {e} raised when {current_user} tried to delete trip {trip_id}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Activity

# CREATE
@app.post('/api/activity/create')
async def create_activity(
    activity: Activity,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        user = await db.get(User, current_user)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        new_activity = ActivityModel(
            user_id=current_user,
            name=activity.name,
            cost=activity.cost or 0.0
        )
        db.add(new_activity)
        await db.commit()
        await db.refresh(new_activity)
        return {"message": "Activity created", "activity_id": new_activity.id}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# GET ALL (user's activities)
@app.get('/api/activities')
async def get_activities(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        result = await db.execute(
            select(ActivityModel).where(ActivityModel.user_id == current_user)
        )
        activities = result.scalars().all()
        return {"activities": [{"id": a.id, "name": a.name, "cost": a.cost} for a in activities]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# DELETE
@app.delete('/api/activity/delete/{activity_id}')
async def delete_activity(
    activity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        result = await db.execute(
            select(ActivityModel).where(
                ActivityModel.id == activity_id,
                ActivityModel.user_id == current_user
            )
        )
        activity = result.scalar_one_or_none()
        if not activity:
            raise HTTPException(status_code=404, detail="Activity not found")

        await db.delete(activity)
        await db.commit()
        return {"message": "Activity deleted"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@app.post('/api/packing/{trip_id}/add')
async def add_packing_item(
    trip_id: str,
    item: PackingItem,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        trip = await db.get(Trip, trip_id)
        if not trip or trip.user_id != current_user:
            raise HTTPException(status_code=404, detail="Trip not found")

        new_item = PackingItems(
            trip_id=trip_id,
            label=item.label,
            category=item.category,
            is_packed=False
        )
        db.add(new_item)
        await db.commit()
        await db.refresh(new_item)
        return {"message": "Item added", "item_id": new_item.id}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@app.get('/api/packing/{trip_id}')
async def get_packing_list(
    trip_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        trip = await db.get(Trip, trip_id)
        if not trip or trip.user_id != current_user:
            raise HTTPException(status_code=404, detail="Trip not found")

        result = await db.execute(
            select(PackingItems).where(PackingItems.trip_id == trip_id)
        )
        items = result.scalars().all()
        return {
            "items": [
                {"id": i.id, "label": i.label, "category": i.category, "is_packed": i.is_packed}
                for i in items
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@app.patch('/api/packing/{item_id}/toggle')
async def toggle_packing_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        item = await db.get(PackingItems, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        trip = await db.get(Trip, item.trip_id)
        if not trip or trip.user_id != current_user:
            raise HTTPException(status_code=403, detail="Not authorized")

        item.is_packed = not item.is_packed
        await db.commit()
        return {"message": "Toggled", "is_packed": item.is_packed}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@app.delete('/api/packing/{item_id}/delete')
async def delete_packing_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        item = await db.get(PackingItems, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        trip = await db.get(Trip, item.trip_id)
        if not trip or trip.user_id != current_user:
            raise HTTPException(status_code=403, detail="Not authorized")

        await db.delete(item)
        await db.commit()
        return {"message": "Item deleted"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# GET all user trips
@app.get('/api/trips')
async def get_trips(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        result = await db.execute(
            select(Trip).where(Trip.user_id == current_user)
        )
        trips = result.scalars().all()
        return {
            "trips": [
                {
                    "id": t.id,
                    "title": t.title,
                    "description": t.description,
                    "cover_photo": t.cover_photo,
                    "start_date": str(t.start_date) if t.start_date else None,
                    "end_date": str(t.end_date),
                    "is_public": t.is_public,
                    "created_at": str(t.created_at)
                }
                for t in trips
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# GET public share view — no auth required
@app.get('/api/trips/share/{token}')
async def get_shared_trip(
    token: str,
    db: AsyncSession = Depends(get_db)
) -> dict:
    try:
        result = await db.execute(
            select(Trip).where(
                Trip.share_token == token,
                Trip.is_public == True
            )
        )
        trip = result.scalar_one_or_none()
        if not trip:
            raise HTTPException(status_code=404, detail="Shared trip not found")

        stops_result = await db.execute(
            select(TripStop).where(TripStop.trip_id == trip.id)
        )
        stops = stops_result.scalars().all()

        return {
            "id": trip.id,
            "title": trip.title,
            "description": trip.description,
            "cover_photo": trip.cover_photo,
            "start_date": str(trip.start_date),
            "end_date": str(trip.end_date),
            "stops": [
                {
                    "id": s.id,
                    "city_name": s.city_name,
                    "arrival_date": str(s.arrival_date),
                    "departure_date": str(s.departure_date)
                }
                for s in stops
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# GET single trip with stops
@app.get('/api/trips/{trip_id}')
async def get_trip(
    trip_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        trip = await db.get(Trip, trip_id)
        if not trip or trip.user_id != current_user:
            raise HTTPException(status_code=404, detail="Trip not found")

        result = await db.execute(
            select(TripStop).where(TripStop.trip_id == trip_id)
        )
        stops = result.scalars().all()

        return {
            "id": trip.id,
            "title": trip.title,
            "description": trip.description,
            "cover_photo": trip.cover_photo,
            "start_date": str(trip.start_date),
            "end_date": str(trip.end_date),
            "is_public": trip.is_public,
            "share_token": trip.share_token,
            "stops": [
                {
                    "id": s.id,
                    "city_name": s.city_name,
                    "arrival_date": str(s.arrival_date),
                    "departure_date": str(s.departure_date),
                    "sort_order": s.sort_order
                }
                for s in stops
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")




# POST publish trip — generate share_token, set is_public=True
@app.post('/api/trips/{trip_id}/publish')
async def publish_trip(
    trip_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> dict:
    try:
        trip = await db.get(Trip, trip_id)
        if not trip or trip.user_id != current_user:
            raise HTTPException(status_code=404, detail="Trip not found")

        # generate token only once
        if not trip.share_token:
            trip.share_token = secrets.token_urlsafe(32)

        trip.is_public = True
        await db.commit()

        return {
            "message": "Trip published",
            "share_token": trip.share_token,
            "share_url": f"/share/{trip.share_token}"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

