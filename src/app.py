from fastapi import FastAPI , HTTPException, Depends, Form
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.core.auth import get_current_user
from src.database.db import Base, engine, get_db
from src.models.schema import TripSchema, TripUpdateSchema
from src.models.tables import User, Trip, PackingItems, Activity

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
    trip_id: int,
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
    trip_id: int,
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

