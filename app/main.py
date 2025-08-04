from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import bubble

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bubble Inventory Tracker")

# ✅ Allow your frontend domain
origins = [
    "https://sandual.netlify.app",   # Main Netlify domain
    "https://*.netlify.app"          # Allow preview deploys (optional)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bubble.router)

@app.get("/")
def root():
    return {"message": "Bubble API MVP is running"}