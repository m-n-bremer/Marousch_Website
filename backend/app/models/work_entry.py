from datetime import datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class WorkEntry(Base):
    __tablename__ = "work_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    contact_id: Mapped[str] = mapped_column(String(50), ForeignKey("contacts.id"), nullable=False)
    date: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD
    mowing: Mapped[bool] = mapped_column(Boolean, default=False)
    contracting: Mapped[bool] = mapped_column(Boolean, default=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    sms_sent_for_cycle: Mapped[bool] = mapped_column(Boolean, default=False)
    invoice_check_checked: Mapped[bool] = mapped_column(Boolean, default=False)
    invoice_check_date: Mapped[str] = mapped_column(String(10), nullable=True)
    invoice_check_invoice_id: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    contact = relationship("Contact", back_populates="work_entries")
    job_checks = relationship("JobCheck", back_populates="work_entry", cascade="all, delete-orphan")
