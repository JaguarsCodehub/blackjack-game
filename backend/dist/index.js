"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const gameController_1 = require("./controllers/gameController");
const config_1 = require("./config");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
// Middleware
// app.use(cors({ origin: '*' }));
app.use(express_1.default.json());
// MongoDB connection
mongoose_1.default
    .connect(config_1.MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((err) => {
    console.error('Error connecting to MongoDB', err);
});
// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    // Game events go here
    socket.on('startGame', () => {
        (0, gameController_1.startGame)(io, socket);
    });
    socket.on('playerMove', (data) => {
        // Handle player move
    });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
