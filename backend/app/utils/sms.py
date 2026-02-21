from app.config import settings


def _get_client():
    from twilio.rest import Client
    return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


def send_sms(to_number: str, message_body: str) -> str:
    client = _get_client()
    message = client.messages.create(
        body=message_body,
        from_=settings.TWILIO_FROM_NUMBER,
        to=to_number,
    )
    return message.sid


def send_invoice_sms(contact_name: str, contact_phone: str, invoice: dict, invoice_url: str) -> str:
    headline = invoice.get("headline", "Invoice")
    line_items = invoice.get("line_items", [])
    bullets = "\n".join(f"  - {item['description']}" for item in line_items)
    total = invoice.get("total_amount", 0)

    body = (
        f"Hi {contact_name}, here is your {headline} Invoice:\n\n"
        f"{bullets}\n\n"
        f"Total: ${total:.2f}\n\n"
        f"View full invoice: {invoice_url}\n\n"
        f"Thank you for your business!"
    )
    return send_sms(contact_phone, body)
