from fastapi import APIRouter
from app.api.api_v1.endpoints import feedback, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
