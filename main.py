from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from model import *

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
user_id = 1

# Зависимость для получения сессии базы данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Эндпоинты для работы с пользователями
@app.get("/users/")
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()


@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
 user = db.query(User).filter(User.user_id == user_id).first()
 if user is None:
     raise HTTPException(status_code=404, detail="User not found")
 return user

@app.put("/users/{user_id}")
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.user_id == user_id).first()
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user.dict(exclude_unset=True).items():
        setattr(existing_user, key, value)

    db.commit()
    db.refresh(existing_user)
    return existing_user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}


# Эндпоинты для работы с уровнями
@app.get("/levels/")
def read_levels(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Level).offset(skip).limit(limit).all()


@app.get("/levels/{levels_id}")
def read_levels(levels_id: int, db: Session = Depends(get_db)):
    level = db.query(Level).filter(Level.levels_id == levels_id).first()  # Получаем всю запись уровня

    if level is None:
        raise HTTPException(status_code=404, detail="Уровень не найден")  # Обрабатываем случай, если уровень не найден

    return level

@app.delete("/levels/{levels_id}")
def delete_level(levels_id: int, db: Session = Depends(get_db)):
    level = db.query(Level).filter(Level.levels_id == levels_id).first()
    if level is None:
        raise HTTPException(status_code=404, detail="Level not found")

    db.delete(level)
    db.commit()
    return {"detail": "Level deleted successfully"}


# Эндпоинты для работы с привычками
@app.get("/habbities/")
def read_habbities(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Habit).offset(skip).limit(limit).all()


@app.post("/habbities/")
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    new_habit = Habit(**habit.dict())
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    return new_habit


@app.put("/habbities/{habbit_id}")
def update_habit(habbit_id: int, habit: HabitUpdate, db: Session = Depends(get_db)):
    existing_habit = db.query(Habit).filter(Habit.habbit_id == habbit_id).first()
    if existing_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    for key, value in habit.dict(exclude_unset=True).items():
        setattr(existing_habit, key, value)

    db.commit()
    db.refresh(existing_habit)
    return existing_habit


@app.post("/users/{user_id}/habit/")
def create_habit_for_user(user_id: int, habit: HabitCreate, db: Session = Depends(get_db)):
   try:
       habit = habit.dict()
       habit['user_id'] = user_id
       new_habit = Habit(**habit)
       db.add(new_habit)
       db.commit()
       db.refresh(new_habit)
       return new_habit
   except Exception as e:
       print(f"Error occurred: {e}")
       raise HTTPException(status_code=500, detail="Internal Server Error")


@app.delete("/habbities/{habbit_id}")
def delete_habit(habbit_id: int, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.habbit_id == habbit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    db.delete(habit)
    db.commit()
    return {"detail": "Habit deleted successfully"}


# Эндпоинты для работы с задачами
@app.get("/tasks/")
def read_tasks(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Task).offset(skip).limit(limit).all()


@app.post("/tasks/")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.post("/users/{user_id}/tasks/")
def create_task_for_user(user_id: int, task: TaskCreate, db: Session = Depends(get_db)):
   try:
       task_data = task.dict()
       task_data['user_id'] = user_id
       new_task = Task(**task_data)
       db.add(new_task)
       db.commit()
       db.refresh(new_task)
       return new_task
   except Exception as e:
       print(f"Error occurred: {e}")
       raise HTTPException(status_code=500, detail="Internal Server Error")
@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    existing_task = db.query(Task).filter(Task.task_id == task_id).first()
    if existing_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task.dict(exclude_unset=True).items():
        setattr(existing_task, key, value)

    db.commit()
    db.refresh(existing_task)
    return existing_task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"detail": "Task deleted successfully"}


# Эндпоинты для работы с ежедневными задачами
@app.get("/dailies/")
def read_dailies(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Daily).offset(skip).limit(limit).all()


@app.post("/dailies/")
def create_daily(daily: DailyCreate, db: Session = Depends(get_db)):
    new_daily = Daily(**daily.dict())
    db.add(new_daily)
    db.commit()
    db.refresh(new_daily)
    return new_daily


@app.put("/dailies/{daily_id}")
def update_daily(daily_id: int, daily: DailyUpdate, db: Session = Depends(get_db)):
    existing_daily = db.query(Daily).filter(Daily.daily_id == daily_id).first()
    if existing_daily is None:
        raise HTTPException(status_code=404, detail="Daily task not found")

    for key, value in daily.dict(exclude_unset=True).items():
        setattr(existing_daily, key, value)

    db.commit()
    db.refresh(existing_daily)
    return existing_daily


@app.delete("/dailies/{daily_id}")
def delete_daily(daily_id: int, db: Session = Depends(get_db)):
    daily = db.query(Daily).filter(Daily.daily_id == daily_id).first()
    if daily is None:
        raise HTTPException(status_code=404, detail="Daily task not found")

    db.delete(daily)
    db.commit()
    return {"detail": "Daily task deleted successfully"}


# Эндпоинты для работы с повторяемостью
@app.get("/repeatabilities/")
def read_repeatabilities(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Repeatability).offset(skip).limit(limit).all()



@app.delete("/repeatabilities/{repeatability_id}")
def delete_repeatability(repeatability_id: int, db: Session = Depends(get_db)):
    repeatability = db.query(Repeatability).filter(Repeatability.repeatability_id == repeatability_id).first()
    if repeatability is None:
        raise HTTPException(status_code=404, detail="Repeatability not found")

    db.delete(repeatability)
    db.commit()
    return {"detail": "Repeatability deleted successfully"}

# Монтируем статические файлы
app.mount("/style", StaticFiles(directory="style"), name="style")
app.mount("/source", StaticFiles(directory="source"), name="source")

# Маршрут для обслуживания index.html
@app.get("/", response_class=HTMLResponse)
async def read_index():
    with open("pages/index.html", "r", encoding="utf-8") as file:
        return HTMLResponse(content=file.read())

@app.get("/page", response_class=HTMLResponse)
async def read_page():
    with open("pages/index.html", "r", encoding="utf-8") as file:
        return HTMLResponse(content=file.read())

@app.get("/users/{user_id}/tasks")
def read_user_tasks(user_id: int, db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    if tasks is None:
        raise HTTPException(status_code=404, detail="tasks not found")
    return tasks

@app.get("/users/{user_id}/dailies")
def read_user_dailies(user_id: int, db: Session = Depends(get_db)):
    dailies = db.query(Daily).filter(Daily.user_id == user_id).all()
    if dailies is None:
        raise HTTPException(status_code=404, detail="dailies not found")
    return dailies

@app.get("/users/{user_id}/habbites")
def read_user_habbites(user_id: int, db: Session = Depends(get_db)):
    habbites = db.query(Habit).filter(Habit.user_id == user_id).all()
    if habbites is None:
        raise HTTPException(status_code=404, detail="habbites not found")
    return habbites





if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
