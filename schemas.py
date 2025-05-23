from pydantic import BaseModel
from typing import Optional

# === User ===
class UserCreate(BaseModel):
    login: str
    email: str
    password: str
    level_id: int


class UserRead(BaseModel):
    login: str
    email: str
    password: str
    level_id: int
    score: int
    money: int
    mood: int


class UserUpdate(BaseModel):
    login: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    level_id: Optional[int] = None
    score: Optional[int] = None
    money: Optional[int] = None
    mood: Optional[int] = None

class UserPartialUpdate(BaseModel):
    login: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    level_id: Optional[int] = None
    score: Optional[int] = None
    money: Optional[int] = None
    mood: Optional[int] = None

# === Habit ===
class HabitCreate(BaseModel):
    name: str
    is_positive: bool
    user_id: int
    times: Optional[int] = 0

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    is_positive: Optional[bool] = None
    user_id: Optional[int] = None
    times: Optional[int] = None

# === Task ===
class TaskCreate(BaseModel):
    name: str
    user_id: int
    is_done: Optional[bool] = False

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    user_id: Optional[int] = None
    is_done: Optional[bool] = None

# === Daily ===
class DailyCreate(BaseModel):
    name: str
    repeatability_id: int
    user_id: int
    is_done: Optional[bool] = False

class DailyUpdate(BaseModel):
    name: Optional[str] = None
    repeatability_id: Optional[int] = None
    user_id: Optional[int] = None
    is_done: Optional[bool] = None


class LevelCreate(BaseModel):
    levels_id: Optional[int] = None  # Можно опустить при создании, если автоинкремент
    level_top: int  # Например, максимальный уровень или порог очков

class LevelUpdate(BaseModel):
    level_top: Optional[int]