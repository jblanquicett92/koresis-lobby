import stripe
import os

class StripeService:
    @staticmethod
    def create_checkout_session(plan_name: str, interval: int) -> dict:
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        
        # Mapping base prices in USD
        amount_map = {
            "price_basic_name": 69,
            "price_pro_name": 149,
            "price_prem_name": 199,
            "Basic": 69,
            "Pro": 149,
            "Premium": 199
        }
        
        base_price = amount_map.get(plan_name, 69)
        
        # Calculate total price and specific interval text
        if interval == 1:
            total_price = base_price
            interval_str = "1 mes"
        elif interval == 6:
            total_price = base_price * 5
            interval_str = "6 meses"
        else:
            total_price = base_price * 10
            interval_str = "12 meses"
            
        try:
            # We create a one-time charge session instead of a monthly subscription 
            # for this prototype since subscriptions require pre-created products in Stripe Dashboard.
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': f'Orbit by Koresis - Plan {plan_name} ({interval_str})',
                            'description': 'Acceso total a las funciones del Lobby (API en tiempo real, Branding)'
                        },
                        # amount in cents
                        'unit_amount': total_price * 100,
                    },
                    'quantity': 1,
                }],
                # We use payment mode
                mode='payment',
                success_url='http://localhost:3000/comenzar?success=true',
                cancel_url='http://localhost:3000/comenzar?cancel=true',
            )
            print("Session de pago creada:", session.id)
            return {"sessionId": session.id, "url": session.url}
        except Exception as e:
            print("Error creando Checkout Session:", e)
            raise e
