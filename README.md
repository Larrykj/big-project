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
**Version<img width="644" height="616" alt="Screenshot 2026-01-24 145923" src="https://github.com/user-attachments/assets/a9bf2bb1-97c4-486c-95aa-b11ff3553469" />
**: 1.0.0-Kenya
<img width="1366" height="635" alt="Screenshot 2026-01-24 at 15-02-08 frontend-portal" src="https://github.com/user-attachments/assets/597d89d0-92f4-4695-a6dd-a22b9249ed4f" />
<img width="1366" height="635" alt="Screenshot 2026-01-24 at 15-01-23 frontend-portal" src="https://github.com/user-attachments/assets/9ba5932d-fb81-49f5-b5fb-3d49ed2593fa" />
<img width="1366" height="635" alt="Screenshot 2026-01-24 at 15-01-14 frontend-portal" src="https://github.com/user-attachments/assets/4baf1d1c-0ec8-438a-94e9-d9b70e6758e1" />
<img width="1366" height="635" alt="Screenshot 2026-01-24 at 15-01-51 frontend-portal" src="https://github.com/user-attachments/assets/074bf0a1-80f0-4de3-8491-ce097de6f3c3" />
<img width=<img width="1366" height="635" alt="Screenshot 2026-01-24 at 15-00-28 frontend-portal" src="https://github.com/user-attachments/assets/710d021c-be08-4b2e-b2e1-658de7a86295" />
<img width="1366" height="635" alt="Screenshot 2026-01-24 at 15-00-49 frontend-portal" src="https://github.com/user-attachments/assets/2edba6f0-d985-458d-a5f7-31e8c817b3d5" />
<img width="1366" height="646" alt="Screenshot 2026-01-24 at 14-59-44 frontend-portal" src="https://github.com/user-attachments/assets/cadad0ab-9812-47cc-81a3-5bb70ef35de5" />
<img width="1366" height="635" alt="Screenshot 2026-01-24 at 15-00-05 frontend-portal" src="https://github.com/user-attachments/assets/e5721055-4579-4544-9694-83ef0202ccb5" />
<img width="1366" height="635" alt="Screenshot 2026-01-24 at 15-00-17 frontend-portal" src="https://github.com/user-attachments/assets/dc84e1a1-76af-49b1-9377-a6b4d6be6ac9" />
"1366" height="635" alt="Screenshot 2026-01-24 at 15-01-03 frontend-portal" src="https://github.com/user-attachments/assets/6e6ee0d3-2b45-4f7d-a145-d43193ca57ca" />
