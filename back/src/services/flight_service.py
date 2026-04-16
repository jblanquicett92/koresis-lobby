from typing import Optional
from src.data_access.aerodatabox_client import fetch_flights

STATUS_MAP = {
    "Unknown": "Unknown",
    "Expected": "Scheduled",
    "EnRoute": "In Air",
    "CheckIn": "Scheduled",
    "Boarding": "Boarding",
    "GateClosed": "Final Call",
    "Departed": "Departed",
    "Delayed": "Delayed",
    "Approaching": "In Air",
    "Arrived": "Landed",
    "Canceled": "Cancelled",
    "Diverted": "Cancelled",
    "CanceledUncertain": "Delayed",
}


def _extract_time(time_str: Optional[str]) -> str:
    if not time_str:
        return "--:--"
    try:
        # Format: "2026-04-15 20:46-05:00" or "2026-04-15T20:46"
        normalized = time_str.replace("T", " ")
        return normalized.split(" ")[1][:5]
    except (IndexError, AttributeError):
        return "--:--"


def _normalize_flight(raw: dict, flight_type: str) -> dict:
    departure = raw.get("departure") or {}
    arrival = raw.get("arrival") or {}

    if flight_type == "arrival":
        city = (departure.get("airport") or {}).get("name", "Unknown")
        scheduled_time = _extract_time((arrival.get("scheduledTime") or {}).get("local"))
        gate = arrival.get("gate") or ""
    else:
        city = (arrival.get("airport") or {}).get("name", "Unknown")
        scheduled_time = _extract_time((departure.get("scheduledTime") or {}).get("local"))
        gate = departure.get("gate") or ""

    raw_status = raw.get("status", "Unknown")
    status = STATUS_MAP.get(raw_status, raw_status)
    airline = (raw.get("airline") or {}).get("name", "")

    return {
        "id": raw.get("number", ""),
        "type": flight_type,
        "airline": airline,
        "flightNumber": raw.get("number", ""),
        "city": city,
        "scheduledTime": scheduled_time,
        "estimatedTime": scheduled_time,
        "status": status,
        "gate": gate,
    }


def get_flights(airport: str) -> list[dict]:
    data = fetch_flights(airport)
    arrivals = [_normalize_flight(f, "arrival") for f in (data.get("arrivals") or [])]
    departures = [_normalize_flight(f, "departure") for f in (data.get("departures") or [])]
    flights = arrivals + departures
    flights.sort(key=lambda f: f["scheduledTime"])
    return flights
