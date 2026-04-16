import os
from fastapi import APIRouter, HTTPException, Query
from src.services.flight_service import get_flights

router = APIRouter()

DEFAULT_AIRPORT = os.getenv("AIRPORT_IATA", "ADZ")


@router.get("/flights")
def read_flights(airport: str = Query(default=None)):
    iata = (airport or DEFAULT_AIRPORT).upper()
    try:
        flights = get_flights(iata)
        return {"flights": flights, "airport": iata, "total": len(flights)}
    except Exception as e:
        print(f"Error fetching flights for {iata}: {e}")
        raise HTTPException(status_code=502, detail="Failed to fetch flight data")
