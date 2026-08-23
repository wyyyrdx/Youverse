from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers directly from their respective module files
from app.api.sensors import router as sensors_router
from app.api.predictions import router as predictions_router

# Create the main FastAPI app
app = FastAPI(
    title="Superposition You API",
    description="Backend for Youverse Hackathon Project",
    version="0.1.0"
)

# CORS setup - allow all origins for now, later restrict to frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint - just to confirm server is alive
@app.get("/")
def root():
    return {"message": "Superposition You Backend", "status": "online"}

# Health check endpoint for monitoring
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Include the routers under /api prefix
app.include_router(sensors_router, prefix="/api", tags=["sensors"])
app.include_router(predictions_router, prefix="/api", tags=["predictions"])