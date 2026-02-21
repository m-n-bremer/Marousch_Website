from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactSchema, ContactsPayload

router = APIRouter()


@router.get("")
def get_contacts(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    contacts = db.query(Contact).all()
    return {
        "contacts": [
            ContactSchema(
                id=c.id,
                firstName=c.first_name,
                lastName=c.last_name,
                primaryPhone=c.primary_phone,
                address=c.address,
                email=c.email,
            )
            for c in contacts
        ]
    }


@router.post("")
def save_contacts(payload: ContactsPayload, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    existing_ids = {c.id for c in db.query(Contact.id).all()}
    incoming_ids = {c.id for c in payload.contacts}

    removed_ids = existing_ids - incoming_ids
    if removed_ids:
        db.query(Contact).filter(Contact.id.in_(removed_ids)).delete(synchronize_session=False)

    for c in payload.contacts:
        existing = db.query(Contact).filter(Contact.id == c.id).first()
        if existing:
            existing.first_name = c.firstName
            existing.last_name = c.lastName
            existing.primary_phone = c.primaryPhone
            existing.address = c.address
            existing.email = c.email
        else:
            db.add(Contact(
                id=c.id,
                first_name=c.firstName,
                last_name=c.lastName,
                primary_phone=c.primaryPhone,
                address=c.address,
                email=c.email,
            ))
    db.commit()
    return {"ok": True}
