from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)  # e.g. "c_1771347138185"
    first_name: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    last_name: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    primary_phone: Mapped[str] = mapped_column(String(30), nullable=False, default="")
    address: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    email: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    work_entries = relationship("WorkEntry", back_populates="contact", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="contact", cascade="all, delete-orphan")
    calendar_jobs = relationship("CalendarJob", back_populates="contact", cascade="all, delete-orphan")
    zone_note = relationship("ZoneNote", back_populates="contact", uselist=False, cascade="all, delete-orphan")
    history_records = relationship("HistoryRecord", back_populates="contact", cascade="all, delete-orphan")
