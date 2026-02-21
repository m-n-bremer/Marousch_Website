from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import (
    auth,
    blog,
    bookings,
    calendar_jobs,
    contact_form,
    contacts,
    dashboard,
    gallery,
    history,
    invoices,
    services,
    testimonials,
    users,
    work,
    zones,
)

app = FastAPI(title="Marousch Brothers Contracting", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(contacts.router, prefix="/api/contacts", tags=["Contacts"])
app.include_router(work.router, prefix="/api/work", tags=["Work"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["Invoices"])
app.include_router(calendar_jobs.router, prefix="/api/calendar", tags=["Calendar"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(zones.router, prefix="/api/zones", tags=["Zones"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(services.router, prefix="/api/services", tags=["Services"])
app.include_router(gallery.router, prefix="/api/gallery", tags=["Gallery"])
app.include_router(testimonials.router, prefix="/api/testimonials", tags=["Testimonials"])
app.include_router(blog.router, prefix="/api/blog", tags=["Blog"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(contact_form.router, prefix="/api/contact", tags=["Contact Form"])
