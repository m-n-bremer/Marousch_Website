import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceOut, ServiceUpdate

router = APIRouter()


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


@router.get("", response_model=list[ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return db.query(Service).filter(Service.is_active == True).order_by(Service.display_order).all()


@router.get("/{slug}", response_model=ServiceOut)
def get_service(slug: str, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.slug == slug, Service.is_active == True).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.post("", response_model=ServiceOut)
def create_service(req: ServiceCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    slug = req.slug or _slugify(req.title)
    service = Service(
        title=req.title, slug=slug, short_description=req.short_description,
        full_description=req.full_description, icon_name=req.icon_name,
        image_url=req.image_url, display_order=req.display_order, is_active=req.is_active,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/{service_id}", response_model=ServiceOut)
def update_service(service_id: int, req: ServiceUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    service.is_active = False
    db.commit()
    return {"ok": True}
