// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const alerts = [];


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


function broadcastAlert(alert) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      
      client.send(JSON.stringify({ type: 'ALERT', data: alert }));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('Smartband (or other device) connected via WebSocket.');
});


app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});


app.post('/api/alerts', (req, res) => {
  const { alertType, priority, message, room } = req.body;
  
  const newAlert = {
    id: Date.now().toString(),
    alertType,
    priority,
    message,
    room,
    timestamp: new Date().toISOString(),
  };

  // Insert at the front of the array so recent alerts appear first
  alerts.unshift(newAlert);

  // Broadcast to all WebSocket clients
  broadcastAlert(newAlert);

  // Return the newly created alert
  res.status(201).json(newAlert);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
