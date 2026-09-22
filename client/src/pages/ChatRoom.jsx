

import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useChatSocket } from "../hooks/useChatSocket.js";
import { getRoomMessages } from "../api/message.api.js";

const ChatRoom = () => {
    const { roomId } = useParams();

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    const addMessages = useCallback((incomingMessages) => {
        setMessages((currentMessages) => {
            const messageMap = new Map(
                currentMessages.map((message) => [
                    message.id,
                    message,
                ])
            );

            for (const message of incomingMessages) {
                messageMap.set(message.id, message);
            }

            return Array.from(messageMap.values()).sort(
                (a, b) =>
                    new Date(a.created_at) -
                    new Date(b.created_at)
            );
        });
    }, []);

    const handleNewMessage = useCallback(
        (message) => {
            addMessages([message]);
        },
        [addMessages]
    );

    const { sendMessage } = useChatSocket({
        roomId,
        onMessage: handleNewMessage,
    });

    useEffect(() => {
        const loadMessages = async () => {
            try {
                setLoading(true);

                const messages = await getRoomMessages(roomId);

                addMessages(messages);
            } catch (error) {
                console.error(
                    "Failed to load messages:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, [roomId, addMessages]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            return;
        }
console.log("ds");
        const response = await sendMessage(trimmedContent);
        console.log(response);
console.log(response);
        if (!response.success) {
            console.error(response.message);
            return;
        }

        setContent("");
    };

    if (loading) {
        return <div>Loading messages...</div>;
    }

    return (
        <div>
            <h1>Chat Room</h1>

            <div>
                {messages.map((message) => (
                    <div key={message.id}>
                        <strong>{message.sender_username}</strong>
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Type a message..."
                />

                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatRoom;