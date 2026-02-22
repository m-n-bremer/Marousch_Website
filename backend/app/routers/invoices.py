from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.contact import Contact
from app.models.history_record import HistoryRecord
from app.models.invoice import Invoice
from app.models.invoice_line_item import InvoiceLineItem
from app.schemas.invoice import InvoiceUpdateRequest
from app.utils.sms import send_invoice_sms

router = APIRouter()


def _invoice_to_dict(inv: Invoice) -> dict:
    return {
        "invoiceId": inv.id,
        "contactId": inv.contact_id,
        "createdDate": inv.created_date,
        "headline": inv.headline,
        "lineItems": [{"description": li.description, "amount": li.amount} for li in inv.line_items],
        "totalAmount": inv.total_amount,
        "sent": inv.sent,
        "sentAt": inv.sent_at,
        "contractingNotes": inv.contracting_notes,
    }


@router.get("/")
def list_invoices(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    invoices = db.query(Invoice).order_by(Invoice.created_at.desc()).all()
    return {"invoices": [_invoice_to_dict(inv) for inv in invoices]}


@router.get("/{invoice_id}")
def get_invoice(invoice_id: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    contact = db.query(Contact).filter(Contact.id == invoice.contact_id).first()
    contact_dict = None
    if contact:
        contact_dict = {
            "id": contact.id,
            "firstName": contact.first_name,
            "lastName": contact.last_name,
            "primaryPhone": contact.primary_phone,
            "address": contact.address,
            "email": contact.email,
        }
    return {"invoice": _invoice_to_dict(invoice), "contact": contact_dict}


@router.put("/{invoice_id}")
def update_invoice(invoice_id: str, req: InvoiceUpdateRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    db.query(InvoiceLineItem).filter(InvoiceLineItem.invoice_id == invoice_id).delete()
    for li in req.lineItems:
        db.add(InvoiceLineItem(invoice_id=invoice_id, description=li.description, amount=li.amount))

    invoice.total_amount = sum(li.amount for li in req.lineItems)
    if req.contractingNotes is not None:
        invoice.contracting_notes = req.contractingNotes
    db.commit()
    return {"ok": True, "invoice": _invoice_to_dict(invoice)}


@router.post("/{invoice_id}/send")
def send_invoice(invoice_id: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    contact = db.query(Contact).filter(Contact.id == invoice.contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    invoice_url = f"{settings.APP_BASE_URL}/invoice/{invoice_id}"
    headline = invoice.headline or "Invoice"

    try:
        inv_data = {
            "headline": headline,
            "line_items": [{"description": li.description, "amount": li.amount} for li in invoice.line_items],
            "total_amount": invoice.total_amount,
        }
        send_invoice_sms(contact.first_name, contact.primary_phone, inv_data, invoice_url)

        now_str = datetime.now().isoformat(timespec="seconds")
        invoice.sent = True
        invoice.sent_at = now_str

        db.add(HistoryRecord(
            contact_id=invoice.contact_id,
            type="invoice_sent",
            label=f"{headline} Invoice — ${invoice.total_amount:.2f}",
            date=invoice.created_date,
            timestamp=now_str,
            invoice_id=invoice_id,
        ))
        db.commit()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
