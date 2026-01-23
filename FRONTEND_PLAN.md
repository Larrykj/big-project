# Phase 3: The Frontend (OmniPortal)

## 🎨 Design Philosophy
The "OmniPortal" will be the single pane of glass for the entire operation. It must look **futuristic, data-dense, and premium**.

**Tech Stack:**
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **Map Engine**: Leaflet / React-Leaflet (OpenStreetMap)
- **Charts**: Recharts (for Finance/Analytics)

## 📂 Project Structure
```text
/frontend-portal
  ├── public/
  ├── src/
  │   ├── assets/            (Images, Icons)
  │   ├── components/        
  │   │   ├── common/        (Button, Card, Input - The Design System)
  │   │   ├── layout/        (Sidebar, Topbar)
  │   │   ├── maps/          (LiveTruckMap)
  │   │   └── charts/        (RevenueChart, DeliveryStats)
  │   ├── layouts/           (AuthLayout, DashboardLayout)
  │   ├── pages/
  │   │   ├── Dashboard.tsx  (The Command Center)
  │   │   ├── Orders.tsx     (Java Service)
  │   │   ├── Tracking.tsx   (Node Service)
  │   │   ├── Finance.tsx    (C# Service)
  │   │   └── AI.tsx         (Python Service)
  │   ├── services/
  │   │   ├── api.ts         (Axios instance)
  │   │   ├── coreApi.ts     (Endpoints for Java)
  │   │   ├── financeApi.ts  (Endpoints for C#)
  │   │   └── socket.ts      (WebSocket connection for Node)
  │   ├── store/             (Zustand or Redux Toolkit)
  │   └── App.tsx
```

## 🖥 Page Designs

### 1. **The "Command Center" (Dashboard)**
- **Header**: "Welcome back, Logistics Commander".
- **Top Row**: 4 "Glassmorphism" Cards.
    - *Active Orders* (fetched from Java).
    - *Todays Revenue* (fetched from C#).
    - *Trucks Online* (fetched from Node).
    - *System Health* (Green/Red indicators).
- **Main View**: A magnificent Global Map (Dark Mode) with pulsing dots representing trucks moving in real-time.

### 2. **Finance & Billing**
- A clean, tabular view of Invoices.
- A "Generate Monthly Report" button that triggers the C# PDF Engine.
- A large Line Chart showing profit trends.

### 3. **AI Route Predictor**
- Input: Origin & Destination.
- Output: The Python AI service returns the ETA and creates a polyline on the map showing the traffic probability.

## 🔗 Integration Points
The Frontend will act as the "API Gateway" for the user, talking to all services:
- `GET /api/orders` -> Proxies to **Core Service (Java)**
- `GET /api/invoices` -> Proxies to **Finance Service (C#)**
- `WS wss://tracking` -> Connects to **Realtime Service (Node)**

## 🛠 Next Steps
1. Initialize Vite Project.
2. Install Tailwind & Dependencies.
3. specific Dockerfile for Frontend (nginx).
