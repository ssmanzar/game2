/**
 * BlockWorld — real multiplayer server
 * ------------------------------------
 * Syncs player position, chat, and join/leave across everyone connected.
 * Player data lives in memory only (resets when the server restarts).
 * For real accounts / persistent coins & inventory, swap the in-memory
 * `players` object for a database call (Firebase, Supabase, PlayFab, etc).
 *
 * Setup:
 *   npm install
 *   npm start
 *   -> server runs on http://localhost:3000
 *
 * Then in the BlockWorld login screen, put that URL (or your deployed
 * URL) into "Server URL" and hit Play. Open the game in two tabs / two
 * devices with the same Server URL to see real-time multiplayer.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // allow the static HTML file to connect from anywhere
});

const PORT = process.env.PORT || 3000;

// id -> { name, color, x, z, ry }
const players = {};

app.get('/', (req, res) => {
  res.send('BlockWorld multiplayer server is running. Connect from the game client.');
});

io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  socket.on('join', (data) => {
    const name = String(data.name || 'Guest').slice(0, 16);
    const color = Number.isFinite(data.color) ? data.color : 0xff6f61;

    players[socket.id] = {
      id: socket.id,
      name,
      color,
      x: data.x || 0,
      z: data.z || 0,
      ry: 0,
    };

    // send the new player the current roster
    socket.emit('state', players);

    // tell everyone else someone joined
    socket.broadcast.emit('playerJoined', players[socket.id]);
  });

  socket.on('move', (data) => {
    const p = players[socket.id];
    if (!p) return;
    p.x = data.x;
    p.z = data.z;
    p.ry = data.ry;
    socket.broadcast.emit('playerMoved', { id: socket.id, x: p.x, z: p.z, ry: p.ry });
  });

  socket.on('chat', (data) => {
    const p = players[socket.id];
    if (!p) return;
    const text = String(data.text || '').slice(0, 80);
    if (!text) return;
    socket.broadcast.emit('chat', { id: socket.id, name: p.name, text });
  });

  socket.on('signal', (data) => {
    // WebRTC signaling
    io.to(data.to).emit('signal', {
      from: socket.id,
      signal: data.signal
    });
  });

  socket.on('disconnect', () => {
    const p = players[socket.id];
    delete players[socket.id];
    io.emit('playerLeft', { id: socket.id, name: p ? p.name : undefined });
    console.log('disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log('BlockWorld server listening on http://localhost:' + PORT);
});
