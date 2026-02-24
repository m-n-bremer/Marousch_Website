import datetime as dt

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.blog_post import BlogPost
from app.models.booking import Booking
from app.models.contact import Contact
from app.models.contact_message import ContactMessage
from app.models.calendar_job import CalendarJob
from app.models.invoice import Invoice
from app.models.work_entry import WorkEntry

router = APIRouter()


@router.get("")
def get_dashboard(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    today_str = dt.date.today().isoformat()
    contacts = db.query(Contact).all()
    today_entries = db.query(WorkEntry).filter(WorkEntry.date == today_str).all()

    mowing_clients = sum(1 for e in today_entries if e.mowing)
    contracting_clients = sum(1 for e in today_entries if e.contracting)
    pending_bookings = db.query(Booking).filter(Booking.status == "pending").count()
    unread_messages = db.query(ContactMessage).filter(ContactMessage.is_read == False).count()
    total_blog_posts = db.query(BlogPost).count()

    entries_data = [
        {"contactId": e.contact_id, "date": e.date, "mowing": e.mowing, "contracting": e.contracting}
        for e in today_entries
    ]
    contacts_data = [
        {"id": c.id, "firstName": c.first_name, "lastName": c.last_name,
         "primaryPhone": c.primary_phone, "address": c.address, "email": c.email}
        for c in contacts
    ]

    today = dt.date.today()
    month_start = today.replace(day=1).isoformat()
    next_month = (today.replace(day=28) + dt.timedelta(days=4)).replace(day=1)
    month_end = (next_month - dt.timedelta(days=1)).isoformat()
    upcoming_jobs = (
        db.query(CalendarJob)
        .filter(CalendarJob.date >= month_start, CalendarJob.date <= month_end)
        .order_by(CalendarJob.date)
        .all()
    )
    upcoming_data = [
        {"id": j.id, "contactId": j.contact_id, "date": j.date, "description": j.description, "status": j.status}
        for j in upcoming_jobs
    ]

    return {
        "totalContacts": len(contacts),
        "mowingClients": mowing_clients,
        "contractingClients": contracting_clients,
        "pendingBookings": pending_bookings,
        "unreadMessages": unread_messages,
        "totalBlogPosts": total_blog_posts,
        "todayEntries": entries_data,
        "contacts": contacts_data,
        "upcomingJobs": upcoming_data,
    }


@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    sent_invoices = db.query(Invoice).filter(Invoice.sent == True).all()
    total_invoiced = sum(inv.total_amount for inv in sent_invoices)
    invoice_count = len(sent_invoices)

    monthly_revenue: dict[str, float] = {}
    for inv in sent_invoices:
        month_key = inv.created_date[:7] if inv.created_date else "Unknown"
        monthly_revenue[month_key] = monthly_revenue.get(month_key, 0) + inv.total_amount

    all_entries = db.query(WorkEntry).all()
    mowing_count = sum(1 for e in all_entries if e.mowing)
    contracting_count = sum(1 for e in all_entries if e.contracting)

    return {
        "totalInvoiced": total_invoiced,
        "invoiceCount": invoice_count,
        "monthlyRevenue": monthly_revenue,
        "mowingJobCount": mowing_count,
        "contractingJobCount": contracting_count,
    }
