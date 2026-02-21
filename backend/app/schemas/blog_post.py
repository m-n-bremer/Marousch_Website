from datetime import datetime

from pydantic import BaseModel


class BlogPostCreate(BaseModel):
    title: str
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image_url: str | None = None
    status: str = "draft"
    meta_title: str | None = None
    meta_description: str | None = None


class BlogPostUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image_url: str | None = None
    status: str | None = None
    meta_title: str | None = None
    meta_description: str | None = None


class BlogPostOut(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str | None
    content: str | None
    cover_image_url: str | None
    author_id: str | None
    status: str
    published_at: datetime | None
    meta_title: str | None
    meta_description: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
