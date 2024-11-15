from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()

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

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)