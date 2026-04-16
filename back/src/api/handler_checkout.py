from fastapi import APIRouter
from pydantic import BaseModel
from src.services.stripe_service import StripeService

router = APIRouter()

class CheckoutRequest(BaseModel):
    plan: str
    interval: int

@router.post("/create-checkout-session")
def create_checkout_session(request: CheckoutRequest):
    print(f"Recibida peticion para suscripcion: {request.plan} por {request.interval} meses")
    return StripeService.create_checkout_session(request.plan, request.interval)
