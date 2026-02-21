from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.history_record import HistoryRecord

router = APIRouter()


@router.get("")
def get_history(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    records = db.query(HistoryRecord).order_by(HistoryRecord.id.desc()).all()
    return {
        "records": [
            {
                "type": r.type,
                "contactId": r.contact_id,
                "date": r.date,
                "label": r.label,
                "timestamp": r.timestamp,
                "invoiceId": r.invoice_id,
            }
            for r in records
        ]
    }
