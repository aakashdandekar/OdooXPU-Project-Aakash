from fastapi import FastAPI , HTTPException, Depends, Form
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.core.auth import get_current_user
from src.database.db import Base, engine, get_db
from src.services.helpers import Chatbot
from src.models.tables import User, Trip, PackingItems, Activity as ActivityModel
from src.models.schema import TripSchema, TripUpdateSchema, ActivitySchema as Activity



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

bot = Chatbot()

# ================================================================================
# Endpoints
# ================================================================================

#Aakash Domain
@app.post('/api/chatbot')
async def get_chatbot(
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        user = await db.get(User, current_user)
        if not user:
            raise HTTPException(status_code=400, detail="User does not exist")
        
        
    
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

        new_trip = Trip(**trip.model_dump(), user_id=current_user)
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




"""
trip -> create ki -> user: abc -> 1 -> 1

abc -> 1 -> 1, 2, 3 -> 4
bcd -> 4 -> 
"""

