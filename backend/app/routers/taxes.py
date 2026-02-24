from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.invoice import Invoice

router = APIRouter()


@router.get("/")
def get_tax_data(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    invoices = db.query(Invoice).filter(Invoice.sent == True).order_by(Invoice.created_date.desc()).all()
    invoice_list = [
        {
            "invoiceId": inv.id,
            "contactId": inv.contact_id,
            "createdDate": inv.created_date,
            "headline": inv.headline,
            "totalAmount": inv.total_amount,
            "sentAt": inv.sent_at,
        }
        for inv in invoices
    ]
    grand_total = sum(inv.total_amount for inv in invoices)
    return {"invoices": invoice_list, "grandTotal": grand_total}


class CalculateRequest(BaseModel):
    invoiceIds: list[str]


@router.post("/calculate")
def calculate_total(req: CalculateRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    invoices = db.query(Invoice).filter(Invoice.id.in_(req.invoiceIds)).all()
    total = sum(inv.total_amount for inv in invoices)
    return {"total": total, "count": len(invoices)}
