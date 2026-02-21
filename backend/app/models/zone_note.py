from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ZoneNote(Base):
    __tablename__ = "zone_notes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    contact_id: Mapped[str] = mapped_column(String(50), ForeignKey("contacts.id"), unique=True, nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False, default="")

    contact = relationship("Contact", back_populates="zone_note")
