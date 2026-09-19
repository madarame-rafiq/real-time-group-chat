import { Connection } from 'pg';
import { Server } from 'socket.io'
import { authenticateSession } from './auth-socket.js';
import { registerRoomHandler } from './room.socket.js';
import { registerMessageHandler } from './message.socket.js';

export const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true,
        }
    });

    io.use(authenticateSession);

    
    io.on('connection', (socket) => {
        console.log(`The socket: ${socket} is connected.`);
        
        registerRoomHandler(io, socket);

        registerMessageHandler(io, socket);

        socket.on('disconnect', () => {
            console.log(`The socket: ${socket} has been disconnected.`);
        });
    });

    return io
}