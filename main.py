from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from datetime import datetime
import uvicorn
from sqlalchemy import inspect
from model import Base, engine
from model import *
#Base.metadata.create_all(bind=engine)
app = FastAPI()
app.mount("/source", StaticFiles(directory="source"), name="source")
app.mount("/static", StaticFiles(directory="static"), name="static")
user_id = 6  # Здесь можно использовать реальный user_id

app.mount("/style", StaticFiles(directory="style"), name="style")




# Зависимость для получения сессии базы данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




# Функция для записи изменений в журнал
def log_change(db: Session, change_log: ChangeLogCreate):
    db_change_log = ChangeLog(**change_log.dict())
    db.add(db_change_log)
    db.commit()
    db.refresh(db_change_log)

Base.metadata.create_all(bind=engine)
@app.get("/users/")
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()

@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    change_log = ChangeLogCreate(
        table_name='users',
        record_id=new_user.user_id,
        operation='CREATE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

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

    change_log = ChangeLogCreate(
        table_name='users',
        record_id=user_id,
        operation='UPDATE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

    return existing_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    change_log = ChangeLogCreate(
        table_name='users',
        record_id=user_id,
        operation='DELETE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

    return {"detail": "User deleted successfully"}

# Эндпоинты для работы с уровнями
@app.get("/levels/")
def read_levels(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Level).offset(skip).limit(limit).all()

@app.get("/levels/{levels_id}")
def read_level(levels_id: int, db: Session = Depends(get_db)):
    level = db.query(Level).filter(Level.levels_id == levels_id).first()
    if level is None:
        raise HTTPException(status_code=404, detail="Level not found")
    return level

@app.delete("/levels/{levels_id}")
def delete_level(levels_id: int, db: Session = Depends(get_db)):
    level = db.query(Level).filter(Level.levels_id == levels_id).first()
    if level is None:
        raise HTTPException(status_code=404, detail="Level not found")

    db.delete(level)
    db.commit()

    change_log = ChangeLogCreate(
        table_name='levels',
        record_id=levels_id,
        operation='DELETE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

    return {"detail": "Level deleted successfully"}

# Эндпоинты для работы с привычками
@app.get("/habbities/")
def read_habbities(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Habit).offset(skip).limit(limit).all()


@app.post("/users/{user_id}/habit/")
async def create_habit(user_id: int, habit: HabitCreate, db: Session = Depends(get_db)):
    try:
        # Создание новой привычки
        new_habit = Habit(name=habit.name, is_positive=habit.is_positive, user_id=habit.user_id, times=habit.times)
        db.add(new_habit)
        db.commit()
        db.refresh(new_habit)
        return new_habit
    except SQLAlchemyError as e:
        db.rollback()  # Откат транзакции в случае ошибки
        print(f"Database error: {e}")  # Логирование ошибки
        raise HTTPException(status_code=500, detail="Internal Server Error")
    except Exception as e:
        print(f"Unexpected error: {e}")  # Логирование любой другой ошибки
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/habbities/")
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    new_habit = Habit(**habit.dict())
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)

    change_log = ChangeLogCreate(
        table_name='habbities',
        record_id=new_habit.habbit_id,
        operation='CREATE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

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

    change_log = ChangeLogCreate(
        table_name='habbities',
        record_id=habbit_id,
        operation='UPDATE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

    return existing_habit

@app.delete("/habbities/{habbit_id}")
def delete_habit(habbit_id: int, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.habbit_id == habbit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    db.delete(habit)
    db.commit()

    change_log = ChangeLogCreate(
        table_name='habbities',
        record_id=habbit_id,
        operation='DELETE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

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

    change_log = ChangeLogCreate(
        table_name='tasks',
        record_id=new_task.task_id,
        operation='CREATE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

    return new_task

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    existing_task = db.query(Task).filter(Task.task_id == task_id).first()
    if existing_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task.dict(exclude_unset=True).items():
        setattr(existing_task, key, value)

    db.commit()
    db.refresh(existing_task)

    change_log = ChangeLogCreate(
        table_name='tasks',
        record_id=task_id,
        operation='UPDATE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id
    )
    log_change(db, change_log)

    return existing_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    change_log = ChangeLogCreate(
        table_name='tasks',
        record_id=task_id,
        operation='DELETE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id
    )
    log_change(db, change_log)

    return {"detail": "Task deleted successfully"}

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


@app.patch("/users/{user_id}")
def partial_update_user(user_id: int, user: UserPartialUpdate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.user_id == user_id).first()
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user.dict(exclude_unset=True).items():
        setattr(existing_user, key, value)

    db.commit()
    db.refresh(existing_user)

    return existing_user

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

    change_log = ChangeLogCreate(
        table_name='dailies',
        record_id=new_daily.daily_id,
        operation='CREATE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

    return new_daily

@app.get("/users/{user_id}/tasks")
def read_user_tasks(user_id: int, db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="tasks not found")
    return tasks

@app.get("/users/{user_id}/habbites")
def read_user_habbites(user_id: int, db: Session = Depends(get_db)):
    habbites = db.query(Habit).filter(Habit.user_id == user_id).all()
    if not habbites:
        raise HTTPException(status_code=404, detail="habbites not found")
    return habbites

@app.get("/users/{user_id}/dailies")
def read_user_dailies(user_id: int, db: Session = Depends(get_db)):
    dailies = db.query(Daily).filter(Daily.user_id == user_id).all()
    if not dailies:
        raise HTTPException(status_code=404, detail="dailies not found")
    return dailies


@app.get("/users/{user_id}/dailies/{daily_id}")
def read_user_daily(user_id: int, daily_id: int, db: Session = Depends(get_db)):
    daily = db.query(Daily).filter(Daily.user_id == user_id, Daily.daily_id == daily_id).first()
    if not daily:
        raise HTTPException(status_code=404, detail="Daily task not found")
    return daily

@app.put("/dailies/{daily_id}")
def update_daily(daily_id: int, daily: DailyUpdate, db: Session = Depends(get_db)):
    existing_daily = db.query(Daily).filter(Daily.daily_id == daily_id).first()
    if existing_daily is None:
        raise HTTPException(status_code=404, detail="Daily task not found")

    for key, value in daily.dict(exclude_unset=True).items():
        setattr(existing_daily, key, value)

    db.commit()
    db.refresh(existing_daily)

    change_log = ChangeLogCreate(
        table_name='dailies',
        record_id=daily_id,
        operation='UPDATE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

    return existing_daily

@app.patch("/tasks/{task_id}/toggle")
def toggle_task_status(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id).first()  # Используйте правильное поле для идентификатора
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    # Переключаем значение is_done
    task.is_done = not task.is_done

    db.commit()
    db.refresh(task)

    return {"task_id": task.task_id, "is_done": task.is_done}

@app.post("/users/{user_id}/tasks/")
def create_task_for_user(user_id: int, task: TaskCreate, db: Session = Depends(get_db)):
   task_data = task.dict()
   task_data['user_id'] = user_id
   new_task = Task(**task_data)
   db.add(new_task)
   db.commit()
   db.refresh(new_task)
   return new_task

@app.delete("/dailies/{daily_id}")
def delete_daily(daily_id: int, db: Session = Depends(get_db)):
    daily = db.query(Daily).filter(Daily.daily_id == daily_id).first()
    if daily is None:
        raise HTTPException(status_code=404, detail="Daily task not found")

    db.delete(daily)
    db.commit()

    change_log = ChangeLogCreate(
        table_name='dailies',
        record_id=daily_id,
        operation='DELETE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

    return {"detail": "Daily task deleted successfully"}

@app.get("/repeatabilities/")
def read_repeatabilities(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Repeatability).offset(skip).limit(limit).all()


def check_and_create_tables():
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()

    # Получаем список всех таблиц, которые определены в моделях
    all_tables = Base.metadata.tables.keys()

    # Определяем таблицы, которых нет в базе данных
    missing_tables = [table for table in all_tables if table not in existing_tables]

    if missing_tables:
        print(f"Следующие таблицы отсутствуют и будут созданы: {', '.join(missing_tables)}")
        Base.metadata.create_all(bind=engine)
        print("Таблицы успешно созданы.")
    else:
        print("Все таблицы уже существуют.")



@app.delete("/repeatabilities/{repeatability_id}")
def delete_repeatability(repeatability_id: int, db: Session = Depends(get_db)):
    repeatability = db.query(Repeatability).filter(Repeatability.repeatability_id == repeatability_id).first()
    if repeatability is None:
        raise HTTPException(status_code=404, detail="Repeatability not found")

    db.delete(repeatability)
    db.commit()

    change_log = ChangeLogCreate(
        table_name='repeatabilities',
        record_id=repeatability_id,
        operation='DELETE',
        timestamp=str(datetime.utcnow()),
        user_id=user_id  # Замените на реальный user_id
    )
    log_change(db, change_log)

    return {"detail": "Repeatability deleted successfully"}


@app.patch("/habits/{habit_id}/increment_times")
async def increment_habit_times(habit_id: int, db: Session = Depends(get_db)):
    try:
        habit = db.query(Habit).filter(Habit.id == habit_id).first()
        if not habit:
            raise HTTPException(status_code=404, detail="Habit not found")

        habit.times += 1
        db.commit()
        db.refresh(habit)
        return habit
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
@app.get("/", response_class=HTMLResponse)
async def read_index():
    with open("pages/index.html", "r", encoding="utf-8") as file:
        return HTMLResponse(content=file.read())


@app.patch("/users/{user_id}/stats")
def update_user_stats(user_id: int, db: Session = Depends(get_db), score: int = Body(None), mood: int = Body(None),
                      money: int = Body(None)):
    try:
        existing_user = db.query(User).filter(User.user_id == user_id).first()
        if existing_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        # Обновляем только указанные поля, если они переданы
        if score is not None:
            existing_user.score = score
        if mood is not None:
            existing_user.mood = mood
        if money is not None:
            existing_user.money = money

        db.commit()
        db.refresh(existing_user)

        return {"message": "User stats updated successfully", "user": existing_user}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="An error occurred while updating the user")

if __name__ == "__main__":
    check_and_create_tables()

    uvicorn.run(app, host="127.0.0.1", port=8000)
