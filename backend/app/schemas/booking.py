from datetime import datetime

from pydantic import BaseModel


class BookingCreate(BaseModel):
    client_name: str
    client_email: str
    client_phone: str | None = None
    service_id: int | None = None
    preferred_date: str | None = None
    preferred_time: str | None = None
    address: str | None = None
    message: str | None = None


class BookingUpdate(BaseModel):
    status: str | None = None
    admin_notes: str | None = None


class BookingOut(BaseModel):
    id: int
    client_name: str
    client_email: str
    client_phone: str | None
    service_id: int | None
    preferred_date: str | None
    preferred_time: str | None
    address: str | None
    message: str | None
    status: str
    admin_notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
