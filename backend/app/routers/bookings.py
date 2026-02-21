from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingOut, BookingUpdate

router = APIRouter()


@router.post("", response_model=BookingOut)
def create_booking(req: BookingCreate, db: Session = Depends(get_db)):
    booking = Booking(**req.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/admin", response_model=list[BookingOut])
def admin_list_bookings(status: str | None = None, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    q = db.query(Booking).order_by(Booking.created_at.desc())
    if status:
        q = q.filter(Booking.status == status)
    return q.all()


@router.get("/admin/{booking_id}", response_model=BookingOut)
def admin_get_booking(booking_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.put("/admin/{booking_id}", response_model=BookingOut)
def admin_update_booking(booking_id: int, req: BookingUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(booking, field, value)
    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/admin/{booking_id}")
def admin_delete_booking(booking_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"ok": True}
