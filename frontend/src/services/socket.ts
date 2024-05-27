import { io, Socket } from 'socket.io-client';

const URL = 'http://localhost:4000'; // Your backend URL
export const socket: Socket = io(URL);
