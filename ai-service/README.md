# OmniLogistics AI Service

Python FastAPI service providing AI-powered logistics optimization.

## Features

- 🛣️ **Route Optimization** - AI-powered route planning
- 📊 **Delivery Predictions** - ML-based arrival time forecasting
- 📈 **Demand Forecasting** - Predict shipment volumes
- 🚨 **Anomaly Detection** - Identify unusual patterns
- 💰 **Revenue Prediction** - Future revenue forecasting

## Installation

```bash
pip install -r requirements.txt
```

## Running

```bash
python main.py
```

Or with Docker:
```bash
docker-compose up ai-service
```

## API Endpoints

### Health Check
```
GET /health
```

### Route Optimization
```
POST /api/optimize-route
{
  "origin": "Nairobi",
  "destination": "Mombasa",
  "cargo_weight": 5000,
  "priority": "normal"
}
```

### Delivery Prediction
```
POST /api/predict-delivery
{
  "route_id": "RT-1234",
  "historical_data": [4.5, 5.0, 4.8]
}
```

### Demand Forecast
```
GET /api/demand-forecast?region=Nairobi&days=7
```

### Anomaly Detection
```
GET /api/anomaly-detection?truck_id=KBX-001
```

### Revenue Prediction
```
GET /api/analytics/revenue-prediction?months_ahead=3
```

## Technology

- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Port

Default: `5001`
