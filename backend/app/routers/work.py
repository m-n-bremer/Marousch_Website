import datetime as dt
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.history_record import HistoryRecord
from app.models.invoice import Invoice
from app.models.invoice_line_item import InvoiceLineItem
from app.models.job_check import JobCheck
from app.models.work_entry import WorkEntry
from app.schemas.work import (
    CheckRequest,
    DeleteWorkRequest,
    InvoiceCheckRequest,
    MowingInvoiceRequest,
    ResetRequest,
    SaveServicesRequest,
    UncheckRequest,
)

router = APIRouter()


def _entry_to_dict(entry: WorkEntry) -> dict:
    checks = sorted(entry.job_checks, key=lambda jc: jc.week_index)
    return {
        "contactId": entry.contact_id,
        "date": entry.date,
        "mowing": entry.mowing,
        "contracting": entry.contracting,
        "description": entry.description,
        "jobChecks": [
            {"index": jc.week_index, "checked": jc.checked, "dateTime": str(jc.checked_at) if jc.checked_at else None}
            for jc in checks
        ],
        "invoiceCheck": {
            "checked": entry.invoice_check_checked,
            "date": entry.invoice_check_date,
            "invoiceId": entry.invoice_check_invoice_id,
        },
        "smsSentForCycle": entry.sms_sent_for_cycle,
    }


def _find_or_create_entry(db: Session, contact_id: str, target_date: str) -> WorkEntry:
    entry = db.query(WorkEntry).filter(
        WorkEntry.contact_id == contact_id, WorkEntry.date == target_date
    ).first()
    if entry is None:
        entry = WorkEntry(contact_id=contact_id, date=target_date)
        db.add(entry)
        db.flush()
        for i in range(4):
            db.add(JobCheck(work_entry_id=entry.id, week_index=i, checked=False))
        db.flush()
    return entry


@router.get("")
def get_work(date: str | None = None, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = date or dt.date.today().isoformat()
    entries = db.query(WorkEntry).filter(WorkEntry.date == target_date).all()
    return {"entries": [_entry_to_dict(e) for e in entries], "date": target_date}


@router.post("/save-services")
def save_services(req: SaveServicesRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = req.date or dt.date.today().isoformat()
    entry = _find_or_create_entry(db, req.contactId, target_date)
    entry.mowing = req.mowing
    entry.contracting = req.contracting
    if req.description is not None:
        entry.description = req.description
    db.commit()
    return {"ok": True, "entry": _entry_to_dict(entry)}


@router.post("/check")
def check_week(req: CheckRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = req.date or dt.date.today().isoformat()
    entry = _find_or_create_entry(db, req.contactId, target_date)
    jc = next((j for j in entry.job_checks if j.week_index == req.checkIndex), None)
    if jc is None:
        raise HTTPException(status_code=400, detail="Invalid check index")
    now_str = datetime.now().isoformat(timespec="seconds")
    jc.checked = True
    jc.checked_at = now_str

    db.add(HistoryRecord(
        contact_id=req.contactId,
        type="check",
        label=f"Week {req.checkIndex + 1}",
        date=target_date,
        timestamp=now_str,
    ))
    db.commit()
    return {"ok": True, "entry": _entry_to_dict(entry)}


@router.post("/uncheck")
def uncheck_week(req: UncheckRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = req.date or dt.date.today().isoformat()
    entry = db.query(WorkEntry).filter(
        WorkEntry.contact_id == req.contactId, WorkEntry.date == target_date
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    jc = next((j for j in entry.job_checks if j.week_index == req.checkIndex), None)
    if jc is None:
        raise HTTPException(status_code=400, detail="Invalid check index")
    jc.checked = False
    jc.checked_at = None
    db.commit()
    return {"ok": True, "entry": _entry_to_dict(entry)}


@router.post("/delete")
def delete_work(req: DeleteWorkRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = req.date or dt.date.today().isoformat()
    entry = db.query(WorkEntry).filter(
        WorkEntry.contact_id == req.contactId, WorkEntry.date == target_date
    ).first()
    if entry:
        db.delete(entry)
        db.commit()
    return {"ok": True}


@router.post("/reset-checks")
def reset_checks(req: ResetRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = req.date or dt.date.today().isoformat()
    entry = db.query(WorkEntry).filter(
        WorkEntry.contact_id == req.contactId, WorkEntry.date == target_date
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    for jc in entry.job_checks:
        jc.checked = False
        jc.checked_at = None
    entry.sms_sent_for_cycle = False
    entry.invoice_check_checked = False
    entry.invoice_check_date = None
    entry.invoice_check_invoice_id = None
    db.commit()
    return {"ok": True, "entry": _entry_to_dict(entry)}


@router.post("/reset-mowing-flag")
def reset_mowing_flag(req: ResetRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = req.date or dt.date.today().isoformat()
    entry = db.query(WorkEntry).filter(
        WorkEntry.contact_id == req.contactId, WorkEntry.date == target_date
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    entry.sms_sent_for_cycle = False
    db.commit()
    return {"ok": True, "entry": _entry_to_dict(entry)}


@router.post("/reset-invoice-check")
def reset_invoice_check(req: ResetRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = req.date or dt.date.today().isoformat()
    entry = db.query(WorkEntry).filter(
        WorkEntry.contact_id == req.contactId, WorkEntry.date == target_date
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    entry.invoice_check_checked = False
    entry.invoice_check_date = None
    entry.invoice_check_invoice_id = None
    db.commit()
    return {"ok": True, "entry": _entry_to_dict(entry)}


@router.post("/mowing-invoice")
def mowing_invoice(req: MowingInvoiceRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = req.date or dt.date.today().isoformat()
    entry = db.query(WorkEntry).filter(
        WorkEntry.contact_id == req.contactId, WorkEntry.date == target_date
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    checked_jcs = [jc for jc in entry.job_checks if jc.checked]
    if not checked_jcs:
        raise HTTPException(status_code=400, detail="No weeks checked")

    invoice_id = f"inv_{int(datetime.now().timestamp() * 1000)}"
    invoice = Invoice(id=invoice_id, contact_id=req.contactId, created_date=target_date, headline="Mowing")
    db.add(invoice)
    db.flush()

    for jc in sorted(checked_jcs, key=lambda j: j.week_index):
        dt_str = str(jc.checked_at)[:10] if jc.checked_at else ""
        db.add(InvoiceLineItem(
            invoice_id=invoice_id,
            description=f"Mowing — Week {jc.week_index + 1} ({dt_str})",
            amount=0.0,
        ))

    entry.sms_sent_for_cycle = True
    db.commit()
    return {"ok": True, "invoiceId": invoice_id}


@router.post("/invoice-check")
def invoice_check(req: InvoiceCheckRequest, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    target_date = req.date or dt.date.today().isoformat()
    entry = _find_or_create_entry(db, req.contactId, target_date)

    invoice_id = f"inv_{int(datetime.now().timestamp() * 1000)}"
    invoice = Invoice(id=invoice_id, contact_id=req.contactId, created_date=target_date)
    db.add(invoice)

    entry.invoice_check_checked = True
    entry.invoice_check_date = target_date
    entry.invoice_check_invoice_id = invoice_id
    db.commit()
    return {"ok": True, "invoiceId": invoice_id}


@router.get("/month")
def get_work_month(year: int | None = None, month: int | None = None, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    today = dt.date.today()
    y = year or today.year
    m = month or today.month
    prefix = f"{y}-{str(m).zfill(2)}"
    entries = db.query(WorkEntry).filter(WorkEntry.date.startswith(prefix)).all()
    return {"entries": [_entry_to_dict(e) for e in entries], "year": y, "month": m}
