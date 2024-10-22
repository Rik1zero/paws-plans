from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()


# Маршрут для обслуживания index.html
@app.get("/", response_class=HTMLResponse)
async def read_index():
    with open("pages/index.html", "r") as file:
        return HTMLResponse(content=file.read())

@app.get("/page", response_class=HTMLResponse)
async def read_index():
    with open("pages/index.html", "r") as file:
        return HTMLResponse(content=file.read())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)