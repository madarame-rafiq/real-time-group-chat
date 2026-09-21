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

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
});

socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
});