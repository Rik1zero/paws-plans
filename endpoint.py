from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import datetime
from config import USER_ID as user_id
from models import User, Level, Habit, Task, Daily
from schemas import (
    UserCreate, UserUpdate, UserPartialUpdate,
    HabitCreate, HabitUpdate,
    TaskCreate, TaskUpdate,
    DailyCreate, DailyUpdate, LevelCreate, UserRead,
)
from database import get_db



router = APIRouter()

# === Users ===
@router.post("/users/", response_model=UserCreate)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.put("/users/{user_id}", response_model=UserUpdate)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()

    return {"detail": "User deleted"}


@router.patch("/users/{user_id}", response_model=UserPartialUpdate)
def partial_update_user(user_id: int, user_update: UserPartialUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/levels/{levels_id}")
def delete_level(levels_id: int, db: Session = Depends(get_db)):
    db_level = db.query(Level).filter(Level.levels_id == levels_id).first()
    if not db_level:
        raise HTTPException(status_code=404, detail="Level not found")
    db.delete(db_level)
    db.commit()
    return {"detail": "Level deleted"}


# === Habits ===
@router.post("/habits/", response_model=HabitCreate)
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    db_habit = Habit(**habit.dict())
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.get("/habits/{habit_id}", response_model=HabitCreate)
def read_habit(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(Habit).filter(Habit.habit_id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return db_habit


@router.put("/habits/{habit_id}", response_model=HabitUpdate)
def update_habit(habit_id: int, habit_update: HabitUpdate, db: Session = Depends(get_db)):
    db_habit = db.query(Habit).filter(Habit.habit_id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    for key, value in habit_update.dict(exclude_unset=True).items():
        setattr(db_habit, key, value)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.delete("/habits/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(Habit).filter(Habit.habit_id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(db_habit)
    db.commit()

    return {"detail": "Habit deleted"}


# === Tasks ===
@router.post("/tasks/", response_model=TaskCreate)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/tasks/{task_id}", response_model=TaskCreate)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.put("/tasks/{task_id}", response_model=TaskUpdate)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/users/{user_id}/tasks")
def read_user_tasks(user_id: int, db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="Задачи не найдены")
    return tasks


# === Получение ежедневных задач пользователя ===
@router.get("/users/{user_id}/dailies")
def read_user_dailies(user_id: int, db: Session = Depends(get_db)):
    dailies = db.query(Daily).filter(Daily.user_id == user_id).all()
    if not dailies:
        raise HTTPException(status_code=404, detail="Ежедневные задачи не найдены")
    return dailies


# === Получение привычек пользователя ===
@router.get("/users/{user_id}/habits")
def read_user_habits(user_id: int, db: Session = Depends(get_db)):
    habits = db.query(Habit).filter(Habit.user_id == user_id).all()
    if not habits:
        raise HTTPException(status_code=404, detail="Привычки не найдены")
    return habits

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted"}


# === Dailies ===
@router.post("/dailies/", response_model=DailyCreate)
def create_daily(daily: DailyCreate, db: Session = Depends(get_db)):
    db_daily = Daily(**daily.dict())
    db.add(db_daily)
    db.commit()
    db.refresh(db_daily)
    return db_daily


@router.get("/dailies/{daily_id}", response_model=DailyCreate)
def read_daily(daily_id: int, db: Session = Depends(get_db)):
    db_daily = db.query(Daily).filter(Daily.daily_id == daily_id).first()
    if not db_daily:
        raise HTTPException(status_code=404, detail="Daily not found")
    return db_daily


@router.put("/dailies/{daily_id}", response_model=DailyUpdate)
def update_daily(daily_id: int, daily_update: DailyUpdate, db: Session = Depends(get_db)):
    db_daily = db.query(Daily).filter(Daily.daily_id == daily_id).first()
    if not db_daily:
        raise HTTPException(status_code=404, detail="Daily not found")
    for key, value in daily_update.dict(exclude_unset=True).items():
        setattr(db_daily, key, value)
    db.commit()
    db.refresh(db_daily)
    return db_daily

@router.get("/levels/{levels_id}")
def read_level(levels_id: int, db: Session = Depends(get_db)):
    level = db.query(Level).filter(Level.levels_id == levels_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")
    return level

@router.delete("/dailies/{daily_id}")
def delete_daily(daily_id: int, db: Session = Depends(get_db)):
    db_daily = db.query(Daily).filter(Daily.daily_id == daily_id).first()
    if not db_daily:
        raise HTTPException(status_code=404, detail="Daily not found")
    db.delete(db_daily)
    db.commit()
    return {"detail": "Daily deleted"}

