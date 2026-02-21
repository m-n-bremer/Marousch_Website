from pydantic import BaseModel


class SaveServicesRequest(BaseModel):
    contactId: str
    date: str | None = None
    mowing: bool = False
    contracting: bool = False
    description: str | None = None


class CheckRequest(BaseModel):
    contactId: str
    checkIndex: int
    date: str | None = None


class UncheckRequest(BaseModel):
    contactId: str
    checkIndex: int
    date: str | None = None


class DeleteWorkRequest(BaseModel):
    contactId: str
    date: str | None = None


class ResetRequest(BaseModel):
    contactId: str
    date: str | None = None


class MowingInvoiceRequest(BaseModel):
    contactId: str
    date: str | None = None


class InvoiceCheckRequest(BaseModel):
    contactId: str
    date: str | None = None
