from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_async_db
from src.services.reset import reset_user_preferences

router = APIRouter(
    prefix="/reset",
    tags=["reset"],
    responses={404: {"description": "Not found"}},
)


@router.post("", response_model=dict)
async def reset(db: AsyncSession = Depends(get_async_db)):

    reset_status = await reset_user_preferences(db=db)

    if reset_status is True:
        return {
            "message": "Database reset successful",
        }

    elif reset_status is False:
        return {
            "message": "Database reset failed",
        }
