from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class InvoiceLineItem(Base):
    __tablename__ = "invoice_line_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    invoice_id: Mapped[str] = mapped_column(String(50), ForeignKey("invoices.id"), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    amount: Mapped[float] = mapped_column(Float, default=0.0)

    invoice = relationship("Invoice", back_populates="line_items")
