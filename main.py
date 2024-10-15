from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Пример модели данных
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

# Пример GET-запроса
@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

# Пример GET-запроса с параметрами
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

# Пример POST-запроса
@app.post("/items/")
async def create_item(item: Item):
    return item

# Пример PUT-запроса
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, "item": item}

# Пример DELETE-запроса
@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    return {"item_id": item_id, "status": "deleted"}

# Запуск сервера с помощью Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)