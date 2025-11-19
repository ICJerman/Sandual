from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine          # ← removed "backend."
from routers import bubble                 # ← removed "backend."

import logging
logging.basicConfig(level=logging.DEBUG)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bubble Inventory Tracker")

# Allow Netlify main + all preview deploys
origins = [
    "http://localhost:3000",               
    "https://sandual.netlify.app"          
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.netlify\.app",  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(bubble.router)

@app.get("/")
def root():
    return {"message": "Bubble API MVP is running"}