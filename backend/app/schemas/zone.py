from pydantic import BaseModel


class ZonesSaveRequest(BaseModel):
    contactId: str
    notes: str
