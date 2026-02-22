import datetime as dt

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.calendar_job import CalendarJob
from app.schemas.calendar_job import CalendarJobCreate, CalendarJobOut, CalendarJobUpdate

router = APIRouter()


@router.get("/month")
def get_month(year: int | None = None, month: int | None = None, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    today = dt.date.today()
    y = year or today.year
    m = month or today.month
    prefix = f"{y}-{str(m).zfill(2)}"
    jobs = db.query(CalendarJob).filter(CalendarJob.date.startswith(prefix)).all()
    return {
        "jobs": [
            {"id": j.id, "contactId": j.contact_id, "date": j.date, "description": j.description, "status": j.status}
            for j in jobs
        ],
        "year": y,
        "month": m,
    }


@router.post("/jobs", response_model=CalendarJobOut)
def create_job(req: CalendarJobCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    job = CalendarJob(contact_id=req.contactId, date=req.date, description=req.description)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.put("/jobs/{job_id}")
def update_job(job_id: int, req: CalendarJobUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    job = db.query(CalendarJob).filter(CalendarJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if req.date is not None:
        job.date = req.date
    if req.description is not None:
        job.description = req.description
    if req.status is not None:
        job.status = req.status
    if req.contactId is not None:
        job.contact_id = req.contactId
    db.commit()
    db.refresh(job)
    return {"id": job.id, "contactId": job.contact_id, "date": job.date, "description": job.description, "status": job.status}


@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    job = db.query(CalendarJob).filter(CalendarJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"ok": True}
