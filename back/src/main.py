import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.handler_flights import router as flights_router
from src.api.handler_checkout import router as checkout_router

load_dotenv()

app = FastAPI(title="Koresis Lobby API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(flights_router, prefix="/api")
app.include_router(checkout_router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
