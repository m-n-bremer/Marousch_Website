from datetime import datetime

from pydantic import BaseModel


class TestimonialCreate(BaseModel):
    client_name: str
    client_location: str | None = None
    content: str
    rating: int | None = None


class TestimonialUpdate(BaseModel):
    client_name: str | None = None
    client_location: str | None = None
    content: str | None = None
    rating: int | None = None
    is_approved: bool | None = None
    is_featured: bool | None = None


class TestimonialOut(BaseModel):
    id: int
    client_name: str
    client_location: str | None
    content: str
    rating: int | None
    is_approved: bool
    is_featured: bool
    created_at: datetime

    model_config = {"from_attributes": True}
