from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

# Static 및 Template 경로 설정
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# YOLO 모델 로드
model = YOLO("best.pt")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})



# 이미지 업로드 및 예측 라우트
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # 이미지 로드
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # YOLO 모델로 예측 수행
        results = model(image)
        predicted_class = results[0].names[results[0].probs.top1]

        return JSONResponse(content={"weather": predicted_class})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
