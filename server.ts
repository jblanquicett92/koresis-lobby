import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

const app = express();
const PORT = 3000;

// --- Flight Data Mocking ---
interface Flight {
  id: string;
  type: 'arrival' | 'departure';
  airline: string;
  flightNumber: string;
  city: string;
  scheduledTime: string;
  estimatedTime: string;
  status: 'Scheduled' | 'Boarding' | 'Departed' | 'Delayed' | 'Landed' | 'Cancelled' | 'In Air' | 'Final Call';
  gate: string;
}

const airlines = ['AeroLux', 'SkyPremium', 'GlobalAir', 'Horizon', 'Velocity', 'Apex Airlines'];
const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Dubai', 'Singapore', 'Los Angeles', 'Frankfurt', 'Madrid', 'Rome'];
const gates = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'VIP Lounge'];

function generateRandomTime(baseHour: number) {
  const h = (baseHour + Math.floor(Math.random() * 2)).toString().padStart(2, '0');
  const m = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function generateInitialFlights(): Flight[] {
  const flights: Flight[] = [];
  const now = new Date();
  const currentHour = now.getHours();

  for (let i = 0; i < 20; i++) {
    const isArrival = Math.random() > 0.5;
    const scheduledTime = generateRandomTime(currentHour);
    flights.push({
      id: `FL-${i}-${Math.random().toString(36).substr(2, 5)}`,
      type: isArrival ? 'arrival' : 'departure',
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      flightNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9000) + 1000}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      scheduledTime,
      estimatedTime: scheduledTime,
      status: 'Scheduled',
      gate: gates[Math.floor(Math.random() * gates.length)],
    });
  }
  
  // Sort by time
  return flights.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
}

let flights = generateInitialFlights();

// --- SSE Setup ---
let clients: express.Response[] = [];

app.get("/api/flights/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send initial data
  res.write(`data: ${JSON.stringify({ type: 'init', flights })}\n\n`);

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

// Broadcast updates to all clients
function broadcast(data: any) {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// Simulate real-time updates
setInterval(() => {
  if (flights.length === 0) return;
  
  const flightToUpdateIndex = Math.floor(Math.random() * flights.length);
  const flight = flights[flightToUpdateIndex];
  
  const oldStatus = flight.status;
  let newStatus = flight.status;
  let notification = null;

  if (flight.type === 'departure') {
    if (oldStatus === 'Scheduled') newStatus = Math.random() > 0.8 ? 'Delayed' : 'Boarding';
    else if (oldStatus === 'Delayed') newStatus = 'Boarding';
    else if (oldStatus === 'Boarding') newStatus = 'Final Call';
    else if (oldStatus === 'Final Call') newStatus = 'Departed';
  } else {
    if (oldStatus === 'Scheduled') newStatus = Math.random() > 0.8 ? 'Delayed' : 'In Air';
    else if (oldStatus === 'Delayed') newStatus = 'In Air';
    else if (oldStatus === 'In Air') newStatus = 'Landed';
  }

  if (oldStatus !== newStatus) {
    flight.status = newStatus;
    
    // Generate notification for important status changes
    if (newStatus === 'Boarding' || newStatus === 'Final Call' || newStatus === 'Landed' || newStatus === 'Delayed') {
      notification = {
        id: Date.now().toString(),
        message: `Flight ${flight.airline} ${flight.flightNumber} to ${flight.city} is now ${newStatus}.`,
        flightId: flight.id,
        type: newStatus === 'Delayed' ? 'warning' : 'info'
      };
    }

    broadcast({ type: 'update', flight, notification });
  }
}, 5000); // Update a random flight every 5 seconds

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
