from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from app.database import Base, engine
from app.routers import bubble

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bubble Inventory Tracker")

# ✅ Enforce HTTPS (no HTTP allowed)
app.add_middleware(HTTPSRedirectMiddleware)

# ✅ Allow Netlify main + all preview deploys
origins = [
    "https://sandual.netlify.app",  # main site
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.netlify\.app",  # allow previews
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(bubble.router)

@app.get("/")
def root():
    return {"message": "Bubble API MVP is running"}