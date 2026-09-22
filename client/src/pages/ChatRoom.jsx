

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatSocket } from "../hooks/useChatSocket.js";
import { getRoomMessages } from "../api/message.api.js";
import { leaveRoom } from "../api/room.api.js";

const ChatRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [leaving, setLeaving] = useState(false);
    const [error, setError] = useState("");

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
                setError("");

                const messages = await getRoomMessages(roomId);

                addMessages(messages);
            } catch (error) {
                setError(error.message);
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

        const response = await sendMessage(trimmedContent);

        if (!response.success) {
            setError(response.message);
            return;
        }

        setContent("");
    };

    const handleLeaveRoom = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to leave this room?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLeaving(true);
            setError("");

            await leaveRoom(roomId);

            navigate("/", { replace: true });
        } catch (error) {
            setError(error.message);
            setLeaving(false);
        }
    };

    if (loading) {
        return <div>Loading messages...</div>;
    }

    return (
        <div>
            <header>
                <h1>Chat Room</h1>

                <button
                    type="button"
                    onClick={handleLeaveRoom}
                    disabled={leaving}
                >
                    {leaving ? "Leaving..." : "Leave room"}
                </button>
            </header>

            {error && <p>{error}</p>}

            <div>
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((message) => (
                        <div key={message.id}>
                            <strong>
                                {message.sender_username}
                            </strong>

                            <p>{message.content}</p>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Type a message..."
                    disabled={leaving}
                />

                <button
                    type="submit"
                    disabled={leaving}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;

// import { useCallback, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useChatSocket } from "../hooks/useChatSocket.js";
// import { getRoomMessages } from "../api/message.api.js";

// const ChatRoom = () => {
//     const { roomId } = useParams();

//     const [messages, setMessages] = useState([]);
//     const [content, setContent] = useState("");
//     const [loading, setLoading] = useState(true);

//     const addMessages = useCallback((incomingMessages) => {
//         setMessages((currentMessages) => {
//             const messageMap = new Map(
//                 currentMessages.map((message) => [
//                     message.id,
//                     message,
//                 ])
//             );

//             for (const message of incomingMessages) {
//                 messageMap.set(message.id, message);
//             }

//             return Array.from(messageMap.values()).sort(
//                 (a, b) =>
//                     new Date(a.created_at) -
//                     new Date(b.created_at)
//             );
//         });
//     }, []);

//     const handleNewMessage = useCallback(
//         (message) => {
//             addMessages([message]);
//         },
//         [addMessages]
//     );

//     const { sendMessage } = useChatSocket({
//         roomId,
//         onMessage: handleNewMessage,
//     });

//     useEffect(() => {
//         const loadMessages = async () => {
//             try {
//                 setLoading(true);

//                 const messages = await getRoomMessages(roomId);

//                 addMessages(messages);
//             } catch (error) {
//                 console.error(
//                     "Failed to load messages:",
//                     error
//                 );
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadMessages();
//     }, [roomId, addMessages]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         const trimmedContent = content.trim();

//         if (!trimmedContent) {
//             return;
//         }
// console.log("ds");
//         const response = await sendMessage(trimmedContent);
//         console.log(response);
// console.log(response);
//         if (!response.success) {
//             console.error(response.message);
//             return;
//         }

//         setContent("");
//     };

//     if (loading) {
//         return <div>Loading messages...</div>;
//     }

//     return (
//         <div>
//             <h1>Chat Room</h1>

//             <div>
//                 {messages.map((message) => (
//                     <div key={message.id}>
//                         <strong>{message.sender_username}</strong>
//                         <p>{message.content}</p>
//                     </div>
//                 ))}
//             </div>

//             <form onSubmit={handleSubmit}>
//                 <input
//                     value={content}
//                     onChange={(event) =>
//                         setContent(event.target.value)
//                     }
//                     placeholder="Type a message..."
//                 />

//                 <button type="submit">Send</button>
//             </form>
//         </div>
//     );
// };

// export default ChatRoom;