from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)  # e.g. "inv_1771352198335"
    contact_id: Mapped[str] = mapped_column(String(50), ForeignKey("contacts.id"), nullable=False)
    created_date: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD
    headline: Mapped[str] = mapped_column(String(100), nullable=True)  # "Mowing" or None
    total_amount: Mapped[float] = mapped_column(Float, default=0.0)
    sent: Mapped[bool] = mapped_column(Boolean, default=False)
    sent_at: Mapped[str] = mapped_column(String(30), nullable=True)
    contracting_notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    contact = relationship("Contact", back_populates="invoices")
    line_items = relationship("InvoiceLineItem", back_populates="invoice", cascade="all, delete-orphan")
