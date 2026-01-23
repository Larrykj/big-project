from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "OmniLogistics AI Service is Running! [Python FastAPI]"}

@app.get("/predict")
def predict_eta(route_id: int):
    # Simulated prediction logic
    return {
        "route_id": route_id,
        "predicted_eta_minutes": 45,
        "traffic_condition": "moderate"
    }
