import { socket } from "./socket.js";


export const socketConnect = () => {
    if (!socket.connect) {
        socket.connect();
    }
}


export const socketDisconnect = () => {
    if (socket.connect) {
        socket.disconnect();
    }
}