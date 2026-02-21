from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class HistoryRecord(Base):
    __tablename__ = "history_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    contact_id: Mapped[str] = mapped_column(String(50), ForeignKey("contacts.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(30), nullable=False)  # "check" or "invoice_sent"
    label: Mapped[str] = mapped_column(String(300), nullable=False)
    date: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD
    timestamp: Mapped[str] = mapped_column(String(30), nullable=False)
    invoice_id: Mapped[str] = mapped_column(String(50), nullable=True)

    contact = relationship("Contact", back_populates="history_records")
