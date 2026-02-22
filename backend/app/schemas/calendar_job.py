from pydantic import BaseModel, Field


class CalendarJobCreate(BaseModel):
    contactId: str
    date: str
    description: str | None = None


class CalendarJobOut(BaseModel):
    id: int
    contactId: str = Field(validation_alias="contact_id")
    date: str
    description: str | None = None
    status: str = "scheduled"

    model_config = {"from_attributes": True, "populate_by_name": True}


class CalendarJobUpdate(BaseModel):
    date: str | None = None
    description: str | None = None
    status: str | None = None
    contactId: str | None = None
