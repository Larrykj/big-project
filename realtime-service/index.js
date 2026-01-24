const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory truck positions (simulated GPS data)
let truckPositions = {
  'KBX-001': { lat: -1.2921, lng: 36.8219, speed: 65, heading: 'SE', location: 'Nairobi CBD', status: 'on_route' },
  'KCA-054': { lat: -4.0435, lng: 39.6682, speed: 0, heading: 'N', location: 'Mombasa Port', status: 'loading' },
  'KAK-123': { lat: -0.0917, lng: 34.7680, speed: 72, heading: 'E', location: 'Kisumu Highway', status: 'on_route' },
};

// Routes for tracking positions
const routes = {
  'KBX-001': [
    { lat: -1.2921, lng: 36.8219 }, // Nairobi
    { lat: -1.5177, lng: 37.2634 }, // Machakos
    { lat: -3.3832, lng: 38.5567 }, // Voi
    { lat: -4.0435, lng: 39.6682 }, // Mombasa
  ],
  'KAK-123': [
    { lat: -0.0917, lng: 34.7680 }, // Kisumu
    { lat: 0.0517, lng: 35.2724 },  // Eldoret approach
    { lat: -0.2834, lng: 36.0667 }, // Nakuru
    { lat: -1.2921, lng: 36.8219 }, // Nairobi
  ]
};

let routeProgress = { 'KBX-001': 0, 'KAK-123': 0 };

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'OmniLogistics Realtime Service',
    status: 'running',
    version: '1.0.0',
    connectedClients: io.engine.clientsCount
  });
});

// Get all truck positions
app.get('/api/trucks/positions', (req, res) => {
  res.json(truckPositions);
});

// Update truck position (from IoT devices or mobile app)
app.post('/api/trucks/:plateNumber/position', (req, res) => {
  const { plateNumber } = req.params;
  const { lat, lng, speed, heading, location } = req.body;

  truckPositions[plateNumber] = {
    lat, lng, speed, heading, location,
    status: speed > 0 ? 'on_route' : 'stopped',
    lastUpdate: new Date().toISOString()
  };

  // Broadcast to all connected clients
  io.emit('truck_position', { plateNumber, ...truckPositions[plateNumber] });

  res.json({ success: true, position: truckPositions[plateNumber] });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send current positions to new client
  socket.emit('initial_positions', truckPositions);

  // Handle client subscribing to specific truck
  socket.on('subscribe_truck', (plateNumber) => {
    socket.join(`truck_${plateNumber}`);
    console.log(`📍 Client ${socket.id} subscribed to ${plateNumber}`);
    if (truckPositions[plateNumber]) {
      socket.emit('truck_position', { plateNumber, ...truckPositions[plateNumber] });
    }
  });

  // Handle client unsubscribing
  socket.on('unsubscribe_truck', (plateNumber) => {
    socket.leave(`truck_${plateNumber}`);
  });

  // Handle notifications
  socket.on('send_notification', (data) => {
    io.emit('notification', {
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Simulate truck movement (for demo purposes)
setInterval(() => {
  Object.keys(routes).forEach(plateNumber => {
    const route = routes[plateNumber];
    const progress = routeProgress[plateNumber];

    if (progress < route.length - 1) {
      const current = route[progress];
      const next = route[progress + 1];

      // Interpolate position
      const step = 0.02; // Movement step
      let newLat = truckPositions[plateNumber].lat + (next.lat - current.lat) * step;
      let newLng = truckPositions[plateNumber].lng + (next.lng - current.lng) * step;

      // Check if reached next waypoint
      const dist = Math.sqrt(Math.pow(newLat - next.lat, 2) + Math.pow(newLng - next.lng, 2));
      if (dist < 0.1) {
        routeProgress[plateNumber]++;
        newLat = next.lat;
        newLng = next.lng;
      }

      truckPositions[plateNumber] = {
        ...truckPositions[plateNumber],
        lat: newLat,
        lng: newLng,
        speed: 60 + Math.random() * 20,
        lastUpdate: new Date().toISOString()
      };

      // Broadcast update
      io.emit('truck_position', { plateNumber, ...truckPositions[plateNumber] });
    }
  });
}, 3000); // Update every 3 seconds

// Send heartbeat to clients
setInterval(() => {
  io.emit('heartbeat', { timestamp: new Date().toISOString(), trucks: Object.keys(truckPositions).length });
}, 10000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 OmniLogistics Realtime Service listening on port ${PORT}`);
  console.log('📡 WebSocket server ready for connections');
});
