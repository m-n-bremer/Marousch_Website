from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_admin
from app.dependencies.database import get_db
from app.models.equipment import Equipment, Expense

router = APIRouter()


class EquipmentCreate(BaseModel):
    name: str


class ExpenseCreate(BaseModel):
    equipmentId: int
    description: str
    cost: float


@router.get("/")
def list_equipment(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    equipment = db.query(Equipment).order_by(Equipment.name).all()

    def sort_key(eq: Equipment) -> tuple:
        name = eq.name
        # Check if name starts with a digit
        if name and name[0].isdigit():
            # Extract leading number for numeric sort
            num_str = ""
            for ch in name:
                if ch.isdigit():
                    num_str += ch
                else:
                    break
            return (0, int(num_str), name.lower())
        return (1, 0, name.lower())

    equipment = sorted(equipment, key=sort_key)
    result = []
    for eq in equipment:
        expenses = [
            {"id": exp.id, "description": exp.description, "cost": exp.cost, "createdAt": exp.created_at.isoformat()}
            for exp in eq.expenses
        ]
        total = sum(exp.cost for exp in eq.expenses)
        result.append({
            "id": eq.id,
            "name": eq.name,
            "createdAt": eq.created_at.isoformat(),
            "expenses": expenses,
            "total": total,
        })
    grand_total = sum(item["total"] for item in result)
    return {"equipment": result, "grandTotal": grand_total}


@router.post("/equipment")
def add_equipment(req: EquipmentCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    eq = Equipment(name=req.name)
    db.add(eq)
    db.commit()
    db.refresh(eq)
    return {"id": eq.id, "name": eq.name}


@router.delete("/equipment/{equipment_id}")
def delete_equipment(equipment_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    eq = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    db.delete(eq)
    db.commit()
    return {"ok": True}


@router.post("/expense")
def add_expense(req: ExpenseCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    eq = db.query(Equipment).filter(Equipment.id == req.equipmentId).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    exp = Expense(equipment_id=req.equipmentId, description=req.description, cost=req.cost)
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return {"id": exp.id, "description": exp.description, "cost": exp.cost}


@router.delete("/expense/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    exp = db.query(Expense).filter(Expense.id == expense_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(exp)
    db.commit()
    return {"ok": True}
