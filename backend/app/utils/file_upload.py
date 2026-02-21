import os
import uuid

from fastapi import UploadFile

from app.config import settings


async def save_upload(file: UploadFile, subfolder: str = "gallery") -> str:
    upload_dir = os.path.join(settings.UPLOAD_DIR, subfolder)
    os.makedirs(upload_dir, exist_ok=True)

    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(upload_dir, filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    return f"/uploads/{subfolder}/{filename}"
