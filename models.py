from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, index=True)
    login = Column(String(40), nullable=False)
    email = Column(String(64), nullable=False)
    password = Column(String(300), nullable=False)
    level_id = Column(Integer, ForeignKey('levels.levels_id'), nullable=False)
    score = Column(Integer, default=0)
    money = Column(Integer, default=0)
    mood = Column(Integer, default=90)
    habits = relationship("Habit", back_populates="owner")
    tasks = relationship("Task", back_populates="owner")
    dailies = relationship("Daily", back_populates="owner")

class Level(Base):
    __tablename__ = 'levels'
    levels_id = Column(Integer, primary_key=True, index=True)
    level_top = Column(Integer, nullable=False, default=0)

class Habit(Base):
    __tablename__ = 'habbities'
    habit_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(40), nullable=False)
    is_positive = Column(Boolean, nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    times = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    owner = relationship("User", back_populates="habits")

class Task(Base):
    __tablename__ = 'tasks'
    task_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(40), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    is_done = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    owner = relationship("User", back_populates="tasks")

class Daily(Base):
    __tablename__ = 'dailies'
    daily_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(40), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    is_done = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    owner = relationship("User", back_populates="dailies")


