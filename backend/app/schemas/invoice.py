from pydantic import BaseModel


class LineItemSchema(BaseModel):
    description: str = ""
    amount: float = 0.0


class InvoiceUpdateRequest(BaseModel):
    lineItems: list[LineItemSchema] = []
    contractingNotes: str | None = None
