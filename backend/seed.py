"""Seed script: creates admin user and optionally imports existing JSON data from Marousch_Professionals."""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app.config import settings
from app.database import SessionLocal, engine, Base
from app.models import *  # noqa: F401, F403
from app.models.user import User
from app.models.contact import Contact
from app.models.work_entry import WorkEntry
from app.models.job_check import JobCheck
from app.models.invoice import Invoice
from app.models.invoice_line_item import InvoiceLineItem
from app.models.zone_note import ZoneNote
from app.models.history_record import HistoryRecord
from app.models.service import Service
from app.utils.security import hash_password

# Path to existing project data
OLD_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "Marousch_Professionals", "data")


def load_json(filename):
    path = os.path.join(OLD_DATA_DIR, filename)
    if not os.path.exists(path):
        print(f"  [skip] {filename} not found at {path}")
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def seed_admin(db):
    existing = db.query(User).filter(User.email == "admin@marousch.com").first()
    if existing:
        print("Admin user already exists, skipping.")
        return
    admin = User(
        email="admin@marousch.com",
        hashed_password=hash_password("admin123"),
        full_name="Admin",
        is_admin=True,
    )
    db.add(admin)
    db.commit()
    print("Created admin user: admin@marousch.com / admin123")


def import_contacts(db):
    data = load_json("contacts.json")
    if not data:
        return
    contacts = data.get("contacts", [])
    count = 0
    for c in contacts:
        if db.query(Contact).filter(Contact.id == c["id"]).first():
            continue
        db.add(Contact(
            id=c["id"],
            first_name=c.get("firstName", ""),
            last_name=c.get("lastName", ""),
            primary_phone=c.get("primaryPhone", ""),
            address=c.get("address", ""),
            email=c.get("email", ""),
        ))
        count += 1
    db.commit()
    print(f"Imported {count} contacts.")


def import_work_data(db):
    data = load_json("work_data.json")
    if not data:
        return

    # Import work entries
    entries = data.get("entries", [])
    entry_count = 0
    for e in entries:
        existing = db.query(WorkEntry).filter(
            WorkEntry.contact_id == e["contactId"],
            WorkEntry.date == e["date"],
        ).first()
        if existing:
            continue

        invoice_check = e.get("invoiceCheck", {})
        entry = WorkEntry(
            contact_id=e["contactId"],
            date=e["date"],
            mowing=e.get("mowing", False),
            contracting=e.get("contracting", False),
            description=e.get("description"),
            sms_sent_for_cycle=e.get("smsSentForCycle", False),
            invoice_check_checked=invoice_check.get("checked", False),
            invoice_check_date=invoice_check.get("date"),
            invoice_check_invoice_id=invoice_check.get("invoiceId"),
        )
        db.add(entry)
        db.flush()

        for jc in e.get("jobChecks", []):
            db.add(JobCheck(
                work_entry_id=entry.id,
                week_index=jc.get("index", 0),
                checked=jc.get("checked", False),
                checked_at=jc.get("dateTime"),
            ))
        entry_count += 1

    # Import invoices
    invoices = data.get("invoices", [])
    inv_count = 0
    for inv in invoices:
        if db.query(Invoice).filter(Invoice.id == inv["invoiceId"]).first():
            continue
        invoice = Invoice(
            id=inv["invoiceId"],
            contact_id=inv["contactId"],
            created_date=inv.get("createdDate", ""),
            headline=inv.get("headline"),
            total_amount=inv.get("totalAmount", 0.0),
            sent=inv.get("sent", False),
            sent_at=inv.get("sentAt"),
            contracting_notes=inv.get("contractingNotes"),
        )
        db.add(invoice)
        db.flush()

        for li in inv.get("lineItems", []):
            db.add(InvoiceLineItem(
                invoice_id=inv["invoiceId"],
                description=li.get("description", ""),
                amount=li.get("amount", 0.0),
            ))
        inv_count += 1

    db.commit()
    print(f"Imported {entry_count} work entries and {inv_count} invoices.")


def import_zones(db):
    data = load_json("zones.json")
    if not data:
        return
    zones = data.get("zones", [])
    count = 0
    for z in zones:
        if db.query(ZoneNote).filter(ZoneNote.contact_id == z["contactId"]).first():
            continue
        db.add(ZoneNote(contact_id=z["contactId"], notes=z.get("notes", "")))
        count += 1
    db.commit()
    print(f"Imported {count} zone notes.")


def import_history(db):
    data = load_json("history.json")
    if not data:
        return
    records = data.get("records", [])
    # Only import if history table is empty
    if db.query(HistoryRecord).count() > 0:
        print("History records already exist, skipping.")
        return
    count = 0
    for r in records:
        db.add(HistoryRecord(
            contact_id=r["contactId"],
            type=r["type"],
            label=r.get("label", ""),
            date=r.get("date", ""),
            timestamp=r.get("timestamp", ""),
            invoice_id=r.get("invoiceId"),
        ))
        count += 1
    db.commit()
    print(f"Imported {count} history records.")


def seed_services(db):
    services = [
        {"title": "Mowing Service", "slug": "mowing", "short_description": "Professional lawn mowing and maintenance to keep your yard looking its best.", "display_order": 1},
        {"title": "Hard-Scape", "slug": "hardscape", "short_description": "Custom hardscaping including patios, retaining walls, walkways, and outdoor living spaces.", "display_order": 2},
        {"title": "Tree Service", "slug": "tree", "short_description": "Tree trimming, removal, and stump grinding for a clean and safe property.", "display_order": 3},
        {"title": "Water Features", "slug": "water-features", "short_description": "Custom water feature design and installation including ponds, fountains, and waterfalls.", "display_order": 4},
        {"title": "Snow Removal", "slug": "snow-removal", "short_description": "Reliable residential and commercial snow removal services to keep your property safe.", "display_order": 5},
    ]
    count = 0
    for s in services:
        if db.query(Service).filter(Service.slug == s["slug"]).first():
            continue
        db.add(Service(title=s["title"], slug=s["slug"], short_description=s["short_description"], display_order=s["display_order"], is_active=True))
        count += 1
    db.commit()
    print(f"Seeded {count} services.")


def main():
    print("=== Marousch Website Seed Script ===\n")

    db = SessionLocal()
    try:
        print("1. Creating admin user...")
        seed_admin(db)

        print("\n2. Seeding services...")
        seed_services(db)

        if os.path.exists(OLD_DATA_DIR):
            print("\n3. Importing existing data from Marousch_Professionals...")
            import_contacts(db)
            import_work_data(db)
            import_zones(db)
            import_history(db)
        else:
            print(f"\n3. No existing data directory found at {OLD_DATA_DIR}, skipping import.")

        print("\nSeed complete!")
    finally:
        db.close()


if __name__ == "__main__":
    main()
