const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

const playerSlots = {
  player1: null,
  player2: null
};

function assignRole(socketId) {
  if (!playerSlots.player1) {
    playerSlots.player1 = socketId;
    return 'player1';
  }

  if (!playerSlots.player2) {
    playerSlots.player2 = socketId;
    return 'player2';
  }

  return 'spectator';
}

function releaseRole(socketId) {
  if (playerSlots.player1 === socketId) playerSlots.player1 = null;
  if (playerSlots.player2 === socketId) playerSlots.player2 = null;
}

function connectedPlayersCount() {
  let count = 0;
  if (playerSlots.player1) count += 1;
  if (playerSlots.player2) count += 1;
  return count;
}

function emitLobbyUpdate() {
  io.emit('lobby:update', {
    connectedPlayers: connectedPlayersCount(),
    player1Connected: Boolean(playerSlots.player1),
    player2Connected: Boolean(playerSlots.player2)
  });
}

io.on('connection', (socket) => {
  const role = assignRole(socket.id);

  socket.emit('player:role', { role });
  emitLobbyUpdate();

  socket.on('paddle:move', (payload) => {
    if (role === 'spectator') return;

    socket.broadcast.emit('opponent:paddle', {
      role,
      y: payload?.y
    });
  });

  socket.on('disconnect', () => {
    releaseRole(socket.id);
    emitLobbyUpdate();
  });
});

server.listen(PORT, () => {
  console.log(`Paddle multiplayer server draait op http://localhost:${PORT}`);
});
