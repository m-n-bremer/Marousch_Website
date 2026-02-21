from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str | None
    is_admin: bool
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    is_admin: bool = False


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    is_admin: bool | None = None
    is_active: bool | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str
