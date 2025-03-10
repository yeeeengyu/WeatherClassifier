from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from ultralytics import YOLO
import uvicorn
from PIL import Image
import io

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
model = YOLO("best.pt")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

#이미지 가져오고 분류 라우팅
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        #이미지 가져오기
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        #예측
        results = model(image)
        predicted_class = results[0].names[results[0].probs.top1]

        return JSONResponse(content={"weather": predicted_class})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

import os
port = int(os.environ.get("PORT", 8000))
uvicorn.run(app, host="127.0.0.1", port=port) 
