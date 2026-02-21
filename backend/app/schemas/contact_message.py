from datetime import datetime

from pydantic import BaseModel


class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: str | None = None
    subject: str | None = None
    message: str


class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    subject: str | None
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
