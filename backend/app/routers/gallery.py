from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.gallery_image import GalleryImage
from app.schemas.gallery import GalleryImageOut, GalleryImageUpdate
from app.utils.file_upload import save_upload

router = APIRouter()


@router.get("", response_model=list[GalleryImageOut])
def list_images(category: str | None = None, db: Session = Depends(get_db)):
    q = db.query(GalleryImage).order_by(GalleryImage.display_order)
    if category:
        q = q.filter(GalleryImage.category == category)
    return q.all()


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    cats = db.query(GalleryImage.category).distinct().all()
    return {"categories": [c[0] for c in cats if c[0]]}


@router.post("", response_model=GalleryImageOut)
async def upload_image(
    file: UploadFile = File(...),
    title: str | None = Form(None),
    description: str | None = Form(None),
    category: str | None = Form(None),
    is_featured: bool = Form(False),
    display_order: int = Form(0),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    image_url = await save_upload(file, "gallery")
    img = GalleryImage(
        title=title, description=description, image_url=image_url,
        category=category, is_featured=is_featured, display_order=display_order,
    )
    db.add(img)
    db.commit()
    db.refresh(img)
    return img


@router.put("/{image_id}", response_model=GalleryImageOut)
def update_image(image_id: int, req: GalleryImageUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    img = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(img, field, value)
    db.commit()
    db.refresh(img)
    return img


@router.delete("/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    img = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(img)
    db.commit()
    return {"ok": True}
