from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models import Bubble
from database import get_db

router = APIRouter(prefix="/bubbles", tags=["Bubbles"])

# Pydantic schema for input validation
class BubbleCreate(BaseModel):
    product_name: str
    adjustment_type: str
    quantity: float
    notes: str | None = None

@router.get("/")
def get_all_bubbles(db: Session = Depends(get_db)):
    return db.query(Bubble).all()

@router.post("/")
def create_bubble(bubble: BubbleCreate, db: Session = Depends(get_db)):
    new_bubble = Bubble(
        product_name=bubble.product_name,
        adjustment_type=bubble.adjustment_type,
        quantity=bubble.quantity,
        notes=bubble.notes
    )
    db.add(new_bubble)
    db.commit()
    db.refresh(new_bubble)
    return new_bubble

@router.put("/{bubble_id}")
def update_bubble(bubble_id: int, bubble: BubbleCreate, db: Session = Depends(get_db)):
    db_bubble = db.query(Bubble).filter(Bubble.id == bubble_id).first()
    if not db_bubble:
        raise HTTPException(status_code=404, detail="Bubble not found")

    db_bubble.product_name = bubble.product_name
    db_bubble.adjustment_type = bubble.adjustment_type
    db_bubble.quantity = bubble.quantity
    db_bubble.notes = bubble.notes

    db.commit()
    db.refresh(db_bubble)
    return db_bubble

@router.delete("/{bubble_id}")
def delete_bubble(bubble_id: int, db: Session = Depends(get_db)):
    db_bubble = db.query(Bubble).filter(Bubble.id == bubble_id).first()
    if not db_bubble:
        raise HTTPException(status_code=404, detail="Bubble not found")

    db.delete(db_bubble)
    db.commit()
    return {"message": "Bubble deleted successfully"}