"""
3allamni Backend - Kid-Safe AI Tutor & Teacher Workspace
FastAPI application with MySQL database
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import uvicorn

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth, users, schools, classes, assignments, submissions, quests, stats, subscriptions

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="3allamni API",
    description="Kid-Safe AI Tutor & Teacher Workspace Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security scheme
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(schools.router, prefix="/api/v1/schools", tags=["Schools"])
app.include_router(classes.router, prefix="/api/v1/classes", tags=["Classes"])
app.include_router(assignments.router, prefix="/api/v1/assignments", tags=["Assignments"])
app.include_router(submissions.router, prefix="/api/v1/submissions", tags=["Submissions"])
app.include_router(quests.router, prefix="/api/v1/quests", tags=["Quests"])
app.include_router(stats.router, prefix="/api/v1/stats", tags=["Statistics"])
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["Subscriptions"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to 3allamni API - Kid-Safe AI Tutor & Teacher Workspace"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
