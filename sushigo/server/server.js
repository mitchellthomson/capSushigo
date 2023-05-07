const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'lobby.html'));
});

// Store lobbies in a JavaScript object
const lobbies = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('create lobby', ({ name }) => {
    console.log(`Creating lobby with name ${name}`);
    const lobbyCode = uuidv4().slice(0, 6);
    const lobby = {
      name,
      players: [],
    };
    lobbies[lobbyCode] = lobby;
    socket.join(lobbyCode);
    socket.emit('lobby created', { name, lobbyCode });
  });

  socket.on('join lobby', ({ lobbyCode }) => {
    console.log(`Joining lobby with code ${lobbyCode}`);
    const lobby = lobbies[lobbyCode];
    if (lobby) {
      socket.join(lobbyCode);
      socket.emit('joined lobby', lobby);
    } else {
      socket.emit('lobby error', { message: 'Lobby not found' });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});