from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialOut, TestimonialUpdate

router = APIRouter()


@router.get("", response_model=list[TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    return db.query(Testimonial).filter(Testimonial.is_approved == True).order_by(Testimonial.created_at.desc()).all()


@router.post("", response_model=TestimonialOut)
def submit_testimonial(req: TestimonialCreate, db: Session = Depends(get_db)):
    t = Testimonial(client_name=req.client_name, client_location=req.client_location, content=req.content, rating=req.rating)
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.get("/admin", response_model=list[TestimonialOut])
def admin_list_testimonials(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Testimonial).order_by(Testimonial.created_at.desc()).all()


@router.put("/{testimonial_id}", response_model=TestimonialOut)
def update_testimonial(testimonial_id: int, req: TestimonialUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(t, field, value)
    db.commit()
    db.refresh(t)
    return t


@router.delete("/{testimonial_id}")
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(t)
    db.commit()
    return {"ok": True}
