from sqlalchemy import Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class JobCheck(Base):
    __tablename__ = "job_checks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    work_entry_id: Mapped[int] = mapped_column(Integer, ForeignKey("work_entries.id"), nullable=False)
    week_index: Mapped[int] = mapped_column(Integer, nullable=False)  # 0-3
    checked: Mapped[bool] = mapped_column(Boolean, default=False)
    checked_at: Mapped[str] = mapped_column(DateTime, nullable=True)

    work_entry = relationship("WorkEntry", back_populates="job_checks")
