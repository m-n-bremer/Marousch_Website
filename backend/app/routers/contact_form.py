from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate, ContactMessageOut

router = APIRouter()


@router.post("", response_model=ContactMessageOut)
def submit_message(req: ContactMessageCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(**req.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("/admin", response_model=list[ContactMessageOut])
def admin_list_messages(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@router.put("/admin/{message_id}")
def admin_mark_read(message_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    return {"ok": True}


@router.delete("/admin/{message_id}")
def admin_delete_message(message_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"ok": True}
