from datetime import datetime

from pydantic import BaseModel


class ServiceCreate(BaseModel):
    title: str
    slug: str | None = None
    short_description: str | None = None
    full_description: str | None = None
    icon_name: str | None = None
    image_url: str | None = None
    display_order: int = 0
    is_active: bool = True


class ServiceUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    short_description: str | None = None
    full_description: str | None = None
    icon_name: str | None = None
    image_url: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


class ServiceOut(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str | None
    full_description: str | None
    icon_name: str | None
    image_url: str | None
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
