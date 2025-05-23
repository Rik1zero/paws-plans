from sqlalchemy import create_engine, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_and_create_tables():
    from models import Base
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    all_tables = Base.metadata.tables.keys()
    missing_tables = [table for table in all_tables if table not in existing_tables]
    if missing_tables:
        print(f"Создаются отсутствующие таблицы: {', '.join(missing_tables)}")
        Base.metadata.create_all(bind=engine)
        print("Таблицы успешно созданы.")
    else:
        print("Все таблицы уже существуют.")