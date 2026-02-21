import re
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.blog_post import BlogPost
from app.models.user import User
from app.schemas.blog_post import BlogPostCreate, BlogPostOut, BlogPostUpdate

router = APIRouter()


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


@router.get("", response_model=list[BlogPostOut])
def list_posts(db: Session = Depends(get_db)):
    return db.query(BlogPost).filter(BlogPost.status == "published").order_by(BlogPost.published_at.desc()).all()


@router.get("/admin", response_model=list[BlogPostOut])
def admin_list_posts(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()


@router.get("/{slug}", response_model=BlogPostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.status == "published").first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("", response_model=BlogPostOut)
def create_post(req: BlogPostCreate, db: Session = Depends(get_db), user: User = Depends(get_current_admin)):
    slug = req.slug or _slugify(req.title)
    post = BlogPost(
        title=req.title, slug=slug, excerpt=req.excerpt, content=req.content,
        cover_image_url=req.cover_image_url, author_id=user.id, status=req.status,
        meta_title=req.meta_title, meta_description=req.meta_description,
    )
    if req.status == "published":
        post.published_at = datetime.utcnow()
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/{post_id}", response_model=BlogPostOut)
def update_post(post_id: int, req: BlogPostUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    update_data = req.model_dump(exclude_unset=True)
    if "status" in update_data and update_data["status"] == "published" and post.published_at is None:
        post.published_at = datetime.utcnow()
    for field, value in update_data.items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"ok": True}
