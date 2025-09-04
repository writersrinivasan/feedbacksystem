from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_v1.api import api_router
from app.core.database import engine, Base

# Import models to ensure they are registered with SQLAlchemy
from app.models import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FAS-MBBS API",
    description="Medical College Feedback Analysis System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "FAS-MBBS API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
