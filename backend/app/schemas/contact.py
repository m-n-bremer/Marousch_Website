from pydantic import BaseModel


class ContactSchema(BaseModel):
    id: str
    firstName: str = ""
    lastName: str = ""
    primaryPhone: str = ""
    address: str = ""
    email: str = ""


class ContactsPayload(BaseModel):
    contacts: list[ContactSchema]
