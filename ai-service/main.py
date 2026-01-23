from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
from datetime import datetime, timedelta

app = FastAPI(title="OmniLogistics AI Service")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class RouteOptimization(BaseModel):
    origin: str
    destination: str
    cargo_weight: float
    priority: str

class PredictionRequest(BaseModel):
    route_id: str
    historical_data: List[float]

class OptimizedRoute(BaseModel):
    route_id: str
    estimated_time: str
    estimated_cost: float
    fuel_consumption: float
    recommended_truck: str
    waypoints: List[str]

class DeliveryPrediction(BaseModel):
    delivery_id: str
    predicted_arrival: str
    confidence: float
    potential_delays: List[str]

@app.get("/")
def read_root():
    return {
        "service": "OmniLogistics AI Service",
        "version": "1.0.0",
        "status": "operational",
        "capabilities": [
            "Route Optimization",
            "Delivery Time Prediction",
            "Demand Forecasting",
            "Anomaly Detection"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/optimize-route", response_model=OptimizedRoute)
def optimize_route(request: RouteOptimization):
    """
    AI-powered route optimization considering traffic, weather, and historical data
    """
    # Simulated AI optimization (replace with real ML model)
    routes_data = {
        "Nairobi-Mombasa": {
            "time": "6.5 hours",
            "cost": 15000,
            "fuel": 85,
            "truck": "Isuzu FRR",
            "waypoints": ["Nairobi", "Machakos", "Voi", "Mombasa"]
        },
        "Nairobi-Kisumu": {
            "time": "5.5 hours",
            "cost": 12000,
            "fuel": 70,
            "truck": "Mitsubishi Canter",
            "waypoints": ["Nairobi", "Nakuru", "Kisumu"]
        }
    }
    
    route_key = f"{request.origin}-{request.destination}"
    default_route = {
        "time": "4 hours",
        "cost": 10000,
        "fuel": 60,
        "truck": "Mercedes Atego",
        "waypoints": [request.origin, request.destination]
    }
    
    route = routes_data.get(route_key, default_route)
    
    # Adjust for priority
    if request.priority == "urgent":
        route["cost"] *= 1.3
        route["time"] = f"{float(route['time'].split()[0]) * 0.8:.1f} hours"
    
    return OptimizedRoute(
        route_id=f"RT-{random.randint(1000, 9999)}",
        estimated_time=route["time"],
        estimated_cost=route["cost"],
        fuel_consumption=route["fuel"],
        recommended_truck=route["truck"],
        waypoints=route["waypoints"]
    )

@app.post("/api/predict-delivery", response_model=DeliveryPrediction)
def predict_delivery(request: PredictionRequest):
    """
    ML-based delivery time prediction with confidence scores
    """
    # Simulated prediction (replace with trained model)
    base_arrival = datetime.now() + timedelta(hours=random.randint(2, 8))
    
    confidence = random.uniform(0.85, 0.98)
    
    potential_delays = []
    if confidence < 0.90:
        potential_delays = random.sample([
            "Heavy traffic on Mombasa Road",
            "Weather conditions",
            "Road construction near Voi"
        ], k=random.randint(0, 2))
    
    return DeliveryPrediction(
        delivery_id=request.route_id,
        predicted_arrival=base_arrival.isoformat(),
        confidence=round(confidence, 2),
        potential_delays=potential_delays
    )

@app.get("/api/demand-forecast")
def forecast_demand(region: str = "Nairobi", days: int = 7):
    """
    Predict shipment demand for capacity planning
    """
    forecast = []
    for i in range(days):
        date = (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d")
        forecast.append({
            "date": date,
            "predicted_shipments": random.randint(50, 200),
            "confidence": round(random.uniform(0.80, 0.95), 2),
            "peak_hours": ["10:00-12:00", "14:00-16:00"]
        })
    
    return {
        "region": region,
        "forecast_period": f"{days} days",
        "predictions": forecast
    }

@app.get("/api/anomaly-detection")
def detect_anomalies(truck_id: str = "KBX-001"):
    """
    Detect unusual patterns in truck performance
    """
    anomalies = []
    
    # Simulated anomaly detection
    if random.random() > 0.7:
        anomalies.append({
            "type": "fuel_consumption",
            "severity": "medium",
            "message": "Fuel consumption 15% above normal",
            "recommendation": "Check engine efficiency"
        })
    
    if random.random() > 0.8:
        anomalies.append({
            "type": "delivery_delay",
            "severity": "low",
            "message": "Consistent 10min delays",
            "recommendation": "Review route optimization"
        })
    
    return {
        "truck_id": truck_id,
        "analysis_time": datetime.now().isoformat(),
        "anomalies_found": len(anomalies),
        "details": anomalies,
        "overall_health": "good" if len(anomalies) == 0 else "attention_needed"
    }

@app.get("/api/analytics/revenue-prediction")
def predict_revenue(months_ahead: int = 3):
    """
    Predict future revenue based on historical trends
    """
    predictions = []
    base_revenue = 18500000  # Current monthly revenue in KSH
    
    for i in range(1, months_ahead + 1):
        # Simulated growth prediction
        growth_factor = 1 + (random.uniform(0.05, 0.15))
        predicted = base_revenue * growth_factor
        
        month = (datetime.now() + timedelta(days=30*i)).strftime("%B %Y")
        predictions.append({
            "month": month,
            "predicted_revenue_ksh": round(predicted, 2),
            "growth_rate": f"{(growth_factor - 1) * 100:.1f}%",
            "confidence": round(random.uniform(0.75, 0.90), 2)
        })
        
        base_revenue = predicted  # Compound growth
    
    return {
        "current_revenue_ksh": 18500000,
        "prediction_horizon": f"{months_ahead} months",
        "predictions": predictions
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
