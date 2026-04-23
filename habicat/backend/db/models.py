from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from db.database import Base

class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, index=True)
    mode = Column(String(20), nullable=False)   # "light", "normal", "hard"
    content = Column(String(255), nullable=False)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    streak_days = Column(Integer, default=0)
    last_stamped_date = Column(Date, nullable=True)
    menu_id = Column(Integer, ForeignKey("menus.id"), nullable=True)

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    day = Column(Integer, nullable=False)
    content = Column(String(1000), nullable=True)
    is_submit = Column(Boolean, default=False, nullable=False)