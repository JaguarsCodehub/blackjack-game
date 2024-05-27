import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import {
  playerHit,
  playerStand,
  startGame,
} from './controllers/gameController';
import { MONGO_URI } from './config';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());

// Handle socket connections

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('startGame', () => {
    console.log('startGame event received');
    startGame(io, socket);
  });

  socket.on('playerHit', (data) => {
    console.log('playerHit event received', data);
    playerHit(io, socket, data.gameId);
  });

  socket.on('playerStand', (data) => {
    console.log('playerStand event received', data);
    playerStand(io, socket, data.gameId);
  });
});

const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
