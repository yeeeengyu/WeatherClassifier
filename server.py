from fastapi import FastAPI

server = FastAPI()

@server.get("/")
def root():
    return {"message": "Hello World"}

@server.get("/classify")
def classify():
    return {"message": "Classify something"}