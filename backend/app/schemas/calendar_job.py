from pydantic import BaseModel


class CalendarJobCreate(BaseModel):
    contactId: str
    date: str
    description: str | None = None


class CalendarJobOut(BaseModel):
    id: int
    contactId: str
    date: str
    description: str | None = None
    status: str = "scheduled"

    model_config = {"from_attributes": True}
