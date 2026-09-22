import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useChatSocket } from "../hooks/useChatSocket.js";
import {
    getRoom,
    leaveRoom,
} from "../api/room.api.js";
import { getRoomMessages } from "../api/message.api.js";

const ChatRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [error, setError] = useState("");

    const messagesEndRef = useRef(null);

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
                    new Date(a.sent_at) -
                    new Date(b.sent_at)
            );
        });
    }, []);

    const handleNewMessage = useCallback(
        (message) => {
//             console.log("MESSAGE:", message);
// console.log("sent_at:", message.sent_at);
// console.log("DATE:", new Date(message.sent_at));
            addMessages([message]);
        },
        [addMessages]
    );

    const { sendMessage } = useChatSocket({
        roomId,
        onMessage: handleNewMessage,
    });

    useEffect(() => {
        const loadRoom = async () => {
            try {
                setLoading(true);
                setError("");

                const [roomData, messageData] =
                    await Promise.all([
                        getRoom(roomId),
                        getRoomMessages(roomId),
                    ]);

                setRoom(roomData.room);
                addMessages(messageData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadRoom();
    }, [roomId, addMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent || sending) {
            return;
        }

        try {
            setSending(true);
            setError("");

            const response =
                await sendMessage(trimmedContent);

            if (!response.success) {
                setError(response.message);
                return;
            }

            setContent("");
        } catch {
            setError("Unable to send message.");
        } finally {
            setSending(false);
        }
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

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
                Loading room...
            </main>
        );
    }

    if (!room) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
                Room not found.
            </main>
        );
    }

    

    return (
        <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
            {/* Header */}
            <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-4 sm:px-6">
    <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold">
            {room.name}
        </h1>

        <p className="mt-1 text-xs text-zinc-500">
            Room code:{" "}
            <span className="font-medium text-zinc-300">
                {room.code}
            </span>
        </p>
    </div>

    <button
        type="button"
        onClick={handleLeaveRoom}
        disabled={leaving}
        className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
        {leaving ? "Leaving..." : "Leave room"}
    </button>
</header>

            {/* Error */}
            {error && (
                <div className="border-b border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400 sm:px-6">
                    {error}
                </div>
            )}

            {/* Messages */}
            <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="mx-auto flex max-w-4xl flex-col gap-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center py-20 text-center">
                            <div>
                                <h2 className="text-lg font-medium text-zinc-300">
                                    No messages yet
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Send the first message in
                                    this room.
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isOwnMessage =
                                message.sender_id === user.id;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        isOwnMessage
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                            isOwnMessage
                                                ? "bg-zinc-100 text-zinc-900"
                                                : "bg-zinc-900 text-zinc-100"
                                        }`}
                                    >
                                        {!isOwnMessage && (
                                            <p className="mb-1 text-xs font-medium text-zinc-400">
                                                {
                                                    message.sender_username
                                                }
                                            </p>
                                        )}

                                        <p className="break-words text-sm leading-6">
                                            {message.content}
                                        </p>

                                        <p
                                            className={`mt-1 text-[11px] ${
                                                isOwnMessage
                                                    ? "text-zinc-500"
                                                    : "text-zinc-500"
                                            }`}
                                        >
                                            {formatTime(
                                                message.sent_at
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </section>

            {/* Message input */}
            <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 sm:px-6">
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-4xl gap-3"
                >
                    <input
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        placeholder="Write a message..."
                        maxLength={2000}
                        disabled={sending || leaving}
                        className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 disabled:opacity-50"
                    />

                    <button
                        type="submit"
                        disabled={
                            sending ||
                            leaving ||
                            !content.trim()
                        }
                        className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {sending ? "Sending..." : "Send"}
                    </button>
                </form>
            </footer>
        </main>
    );
};

export default ChatRoom;