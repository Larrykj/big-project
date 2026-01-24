# OmniLogistics Kenya - East Africa Supply Chain Platform

Welcome to **OmniLogistics Kenya**, a next-generation microservices platform designed for high-scale logistics, tracking, and supply chain management across Kenya and East Africa.

## 🌍 Regional Focus

This platform is specifically designed for:
- **Primary Market**: Kenya (Nairobi, Mombasa, Kisumu, Nakuru, Eldoret)
- **Extended Coverage**: Uganda, Tanzania, Rwanda
- **Currency**: Kenyan Shilling (KSH) with multi-currency support (USD, EUR, GBP)
- **Payment Integration**: M-Pesa, Bank Transfers, RTGS

## 🏗 Architecture Overview

This project uses a **Polyglot Microservices Architecture**, meaning each service is built with the language best suited for its specific task.

| Service | Language | Tech Stack | Responsibility | Port |
| :--- | :--- | :--- | :--- | :--- |
| **core-service** | **Java** | Spring Boot | Central ERP, User Auth, Order Management | 8080 |
| **finance-service** | **C#** | .NET 8 | Billing, M-Pesa Integration, KRA Reports | 5000 |
| **realtime-service** | **Node.js** | Express/Socket.io | Live Map Tracking, WebSocket Notifications | 3000 |
| **ai-service** | **Python** | FastAPI / TensorFlow | Route Optimization, Traffic Prediction | 5001 |
| **vendor-portal** | **Ruby** | Rails | Vendor Onboarding, Document Management | 3001 |
| **hardware-bridge** | **C++** | POCO / Boost | High-performance IoT Data from GPS Trackers | 1883 |
| **frontend-portal** | **React** | TypeScript/Vite | Web Dashboard with Kenya Map Integration | 5173 |

## 🚀 Key Features

### For Kenya Market
- **Live GPS Tracking**: Real-time vehicle monitoring across major Kenyan highways
- **M-Pesa Integration**: Native payment processing for KSH transactions
- **Multi-Currency**: Support for USD, EUR, GBP alongside KSH
- **KRA Compliance**: Automated tax reporting and invoice generation
- **SGR Integration**: Support for Standard Gauge Railway logistics
- **Local Routes**: Pre-configured for Nairobi-Mombasa, Nairobi-Kisumu corridors

### Technical Highlights
- Docker-based microservices
- MySQL + MongoDB hybrid database
- Real-time WebSocket updates
- AI-powered route optimization
- Dark/Light mode UI
- Mobile-responsive design

## 🛠 Getting Started

### Prerequisites
- Docker Desktop installed and running

### Installation
1. Start the backend services:
   ```bash
   cd OmniLogistics
   docker-compose up --build
   ```

2. Start the frontend:
   ```bash
   cd frontend-portal
   npm install
   npm run dev
   ```

3. Access the platform:
   - Frontend: http://localhost:5173
   - Java API: http://localhost:8080
   - C# Finance API: http://localhost:5000
   - Python AI API: http://localhost:5001

## 📍 Kenya-Specific Routes

The platform includes optimized routes for:
- **Nairobi ↔ Mombasa** (480 km via A109)
- **Nairobi ↔ Kisumu** (350 km via A104)
- **Nairobi ↔ Nakuru ↔ Eldoret** (Northern Corridor)
- **Mombasa Port ↔ SGR Terminals**

## 💰 Currency & Payments

- **Base Currency**: KSH (Kenyan Shilling)
- **Exchange Rates**: Auto-updated
- **Payment Methods**:
  - M-Pesa (Instant)
  - Bank Transfer (RTGS/EFT)
  - Cheque (Corporate clients)

## 🗓 Development Roadmap

- ✅ **Phase 1**: Core Services (Java + MySQL)
- ✅ **Phase 2**: Finance Service (C# + M-Pesa)
- ✅ **Phase 3**: Frontend Portal (React + Kenya Map)
- 🔄 **Phase 4**: AI Route Optimization (Python)
- 📅 **Phase 5**: Mobile App (React Native)
- 📅 **Phase 6**: Cross-border (Uganda, Tanzania)

## 📊 Tech Stack Justification

Each technology was chosen for a specific reason relevant to the Kenyan market:
- **Java**: Enterprise-grade reliability for core operations
- **C#**: Excellent for financial calculations and KRA integration
- **Node.js**: Real-time GPS tracking requires WebSocket efficiency
- **Python**: AI traffic prediction using Nairobi's complex traffic patterns
- **React**: Modern, fast UI that works on slow connections

## 🇰🇪 Made for Kenya

This platform addresses unique challenges in the Kenyan logistics sector:
- Traffic congestion in Nairobi
- Port delays at Mombasa
- Road conditions on upcountry routes
- Mobile-first payment culture
- Multi-vendor coordination

---

**License**: Proprietary  
**Contact**: info@omnilogistics.ke  | phone Number:+254799543777 | larrykings2002@gmail.com
**Version**: 1.0.0-Kenya
