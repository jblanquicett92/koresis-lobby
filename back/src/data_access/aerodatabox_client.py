import os
import httpx
from dotenv import load_dotenv

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST", "aerodatabox.p.rapidapi.com")
BASE_URL = f"https://{RAPIDAPI_HOST}"


def fetch_flights(airport_iata: str) -> dict:
    url = f"{BASE_URL}/flights/airports/iata/{airport_iata.lower()}"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Content-Type": "application/json",
    }
    params = {
        "offsetMinutes": "-120",
        "durationMinutes": "720",
        "withLeg": "true",
        "direction": "Both",
        "withCancelled": "true",
        "withCodeshared": "true",
        "withCargo": "true",
        "withPrivate": "true",
        "withLocation": "false",
    }
    with httpx.Client(timeout=15) as client:
        response = client.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
