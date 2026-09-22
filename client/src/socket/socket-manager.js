import { socket } from "./socket";



export const socketConnect =async () => {
    // console.log("Inside socketConnct");
    if (!socket.connected) {
        // console.log("Okay we are not connected so we will now");
        await socket.connect();
    }
    // console.log("Aleray connected");
}


export const socketDisconnect = () => {
    if (socket.connect) {
        socket.disconnect();
    }
}

// socket.on("connect", () => {
//     console.log("✅ Actually connected now:", socket.id);
// });

// socket.on("connect_error", (err) => {
//     console.log("❌ Failed:", err.message);
// });

// socket.on("connect", () => {
//     console.log("Socket connected:", socket.id);
// });

// socket.on("connect_error", (error) => {
//     console.error("Socket connection error:", error.message);
// });

// socket.on("disconnect", (reason) => {
//     console.log("Socket disconnected:", reason);
// });