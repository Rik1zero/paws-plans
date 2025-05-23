from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from endpoint import router
app = FastAPI()

# Подключение статики

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/source", StaticFiles(directory="source"), name="source")
app.mount("/style", StaticFiles(directory="style"), name="style")

# Автоматическое создание таблиц
Base.metadata.create_all(bind=engine)

# === Подключение маршрутов ===
app.include_router(router)
# Главная страница
@app.get("/", response_class=HTMLResponse)
async def read_index():
    with open("pages/index.html") as f:
        return HTMLResponse(f.read())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)