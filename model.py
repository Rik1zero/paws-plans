from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from config import DATABASE_URL
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base, relationship


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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


class UserPartialUpdate(BaseModel):
   login: Optional[str] = None
   email: Optional[str] = None
   password: Optional[str] = None
   level_id: Optional[int] = None
   score: Optional[int] = None
   money: Optional[int] = None
   mood: Optional[int] = None

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

class Task(Base):
    __tablename__ = 'tasks'
    task_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(40), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    is_done = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

class Daily(Base):
    __tablename__ = 'dailies'
    daily_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(40), nullable=False)
    repeatability_id = Column(Integer, ForeignKey('repeatabilities.repeatability_id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    is_done = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)


class Repeatability(Base):
    __tablename__ = 'repeatabilities'
    repeatability_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(40), nullable=False)
    time = Column(Integer, nullable=False)
    last_repeat = Column(String, nullable=True)  # Изменено на String, если вы используете дату в виде строки

class UserCreate(BaseModel):
    login: str
    email: str
    password: str  # Обновлено с pass на password
    level_id: int

class UserUpdate(BaseModel):
    login: Optional[str]
    email: Optional[str]
    password: Optional[str]  # Обновлено с pass на password
    level_id: Optional[int]
    score: Optional[int]
    money: Optional[int]
    mood: Optional[int]

# Модели для таблицы habbities
class HabitCreate(BaseModel):
    name: str
    is_positive: bool
    user_id: int
    times: Optional[int] = 0

class HabitUpdate(BaseModel):
    name: Optional[str]
    is_positive: Optional[bool]
    user_id: Optional[int]
    times: Optional[int]

# Модели для таблицы tasks
class TaskCreate(BaseModel):
    name: str
    user_id: int
    is_done: Optional[bool] = False

class TaskUpdate(BaseModel):
    name: Optional[str]
    user_id: Optional[int]
    is_done: Optional[bool]

# Модели для таблицы dailies
class DailyCreate(BaseModel):
    name: str
    repeatability_id: int
    user_id: int
    is_done: Optional[bool] = False

class DailyUpdate(BaseModel):
    name: Optional[str]
    repeatability_id: Optional[int]
    user_id: Optional[int]
    is_done: Optional[bool]

class ChangeLog(Base):
    __tablename__ = 'change_logs'
    id = Column(Integer, primary_key=True, index=True)
    table_name = Column(String, nullable=False)
    record_id = Column(Integer, nullable=False)
    operation = Column(String, nullable=False)  # 'CREATE', 'UPDATE', 'DELETE'
    timestamp = Column(String, nullable=False)  # Можно использовать DateTime для хранения даты
    user_id = Column(Integer, nullable=False)  # ID пользователя, который инициировал изменение

class ChangeLogCreate(BaseModel):
    table_name: str
    record_id: int
    operation: str
    timestamp: str
    user_id: int

