import { useEffect } from "react"
import { socket } from "../socket/socket.js";


export const useChatSocket = ({ roomId, onMessage }) => {
    useEffect(() => {
        if (!roomId) {
            return;
        }

        const handleNewMessage = (message) => {
            onMessage(message);
        }

        socket.emit("room:join", { roomId }, (response) => {
            if (!response.success) {
                console.error(response.message);
            }
        })

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.emit("room:leave", { roomId }, (response) => {
                if (!response?.success) {
                    console.error(response?.message);
                }    
            });
            socket.off("message:new", handleNewMessage);
        }

    }, [roomId, onMessage]);

    const sendMessage = (content) => {
        return new Promise((resolve) => {
            socket.emit("message:send", { roomId, content }, resolve);
        });    
    }

    return {
        sendMessage,
    };
}