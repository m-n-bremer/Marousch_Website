from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.zone_note import ZoneNote
from app.schemas.zone import ZonesSaveRequest

router = APIRouter()


@router.get("")
def get_zones(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    zones = db.query(ZoneNote).all()
    return {"zones": [{"contactId": z.contact_id, "notes": z.notes} for z in zones]}


@router.post("")
def save_zone(req: ZonesSaveRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    zone = db.query(ZoneNote).filter(ZoneNote.contact_id == req.contactId).first()
    if zone:
        zone.notes = req.notes
    else:
        db.add(ZoneNote(contact_id=req.contactId, notes=req.notes))
    db.commit()
    return {"ok": True}
