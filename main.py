from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from ultralytics import YOLO
from PIL import Image
import io
# 배포성공

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
model = YOLO("model/best.pt")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        results = model(image)
        predicted_class = results[0].names[results[0].probs.top1]
        res = results[0]
        names = res.names
        probs = res.probs.data.tolist()
        weather = {names[i]: float(prob) for i, prob in enumerate(probs)}

        return JSONResponse(content={"weather": predicted_class, "log": weather})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500) 
