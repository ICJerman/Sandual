from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime
from database import Base

class Bubble(Base):
    __tablename__ = "bubbles"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, nullable=False)            # Name of material/product
    adjustment_type = Column(String, nullable=False)         # inbound, outbound, adjustment
    quantity = Column(Float, nullable=False)                  # Qty adjusted
    status = Column(String, default="active")                 # active, archived
    created_at = Column(DateTime, default=datetime.utcnow)    # Timestamp
    notes = Column(String)                                   # Optional notes