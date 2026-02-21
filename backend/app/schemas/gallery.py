from datetime import datetime

from pydantic import BaseModel


class GalleryImageUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    is_featured: bool | None = None
    display_order: int | None = None


class GalleryImageOut(BaseModel):
    id: int
    title: str | None
    description: str | None
    image_url: str
    category: str | None
    is_featured: bool
    display_order: int
    created_at: datetime

    model_config = {"from_attributes": True}
