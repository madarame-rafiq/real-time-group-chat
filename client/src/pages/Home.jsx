import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
    createRoom,
    getRooms,
    joinRoom,
} from "../api/room.api.js";

const Home = () => {
    const { user, logout } = useAuth();

    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const loadRooms = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getRooms();
                setRooms(data.rooms);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, []);

    const handleCreateRoom = async (event) => {
        event.preventDefault();

        const name = roomName.trim();

        if (!name) {
            return;
        }

        try {
            setCreating(true);
            setError("");

            const data = await createRoom(name);

            setRooms((currentRooms) => [
                data.room,
                ...currentRooms,
            ]);

            setRoomName("");
        } catch (error) {
            setError(error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleJoinRoom = async (event) => {
        event.preventDefault();

        const code = roomCode.trim();

        if (!code) {
            return;
        }

        try {
            setJoining(true);
            setError("");

            const data = await joinRoom(code);

            setRooms((currentRooms) => {
                const alreadyExists = currentRooms.some(
                    (room) => room.id === data.room.id
                );

                if (alreadyExists) {
                    return currentRooms;
                }

                return [data.room, ...currentRooms];
            });

            setRoomCode("");
        } catch (error) {
            setError(error.message);
        } finally {
            setJoining(false);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">

            {/* Header */}
            <header className="border-b border-zinc-800">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">

                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-sm font-bold text-zinc-950">
                            C
                        </div>

                        <div>
                            <h1 className="font-semibold tracking-tight">
                                Chat
                            </h1>

                            <p className="text-xs text-zinc-500">
                                Welcome, {user.username}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-100"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main content */}
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

                {/* Intro */}
                <section className="mb-10">
                    <p className="mb-2 text-sm font-medium text-zinc-500">
                        Your workspace
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Your conversations
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                        Create a room or join an existing conversation
                        using a room code.
                    </p>
                </section>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Create + Join */}
                <section className="mb-12 grid gap-5 md:grid-cols-2">

                    {/* Create room */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-7">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">
                                Create a room
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Start a new persistent conversation.
                            </p>
                        </div>

                        <form
                            onSubmit={handleCreateRoom}
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="roomName"
                                    className="mb-2 block text-sm font-medium text-zinc-300"
                                >
                                    Room name
                                </label>

                                <input
                                    id="roomName"
                                    value={roomName}
                                    onChange={(event) =>
                                        setRoomName(event.target.value)
                                    }
                                    placeholder="e.g. Project Discussion"
                                    maxLength={30}
                                    disabled={creating}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={creating || !roomName.trim()}
                                className="w-full rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {creating
                                    ? "Creating..."
                                    : "Create room"}
                            </button>
                        </form>
                    </div>

                    {/* Join room */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-7">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">
                                Join a room
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Enter a room code to join an existing
                                conversation.
                            </p>
                        </div>

                        <form
                            onSubmit={handleJoinRoom}
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="roomCode"
                                    className="mb-2 block text-sm font-medium text-zinc-300"
                                >
                                    Room code
                                </label>

                                <input
                                    id="roomCode"
                                    value={roomCode}
                                    onChange={(event) =>
                                        setRoomCode(
                                            event.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="e.g. X7K92M"
                                    maxLength={6}
                                    disabled={joining}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm uppercase tracking-widest text-zinc-100 outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-600 focus:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={joining || !roomCode.trim()}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {joining
                                    ? "Joining..."
                                    : "Join room"}
                            </button>
                        </form>
                    </div>
                </section>

                {/* Rooms */}
                <section>
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold">
                            Your rooms
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Rooms you've joined or created.
                        </p>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-12 text-center">
                            <p className="text-sm text-zinc-500">
                                Loading rooms...
                            </p>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-xl text-zinc-500">
                                +
                            </div>

                            <h3 className="mt-5 text-sm font-medium text-zinc-300">
                                No rooms yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-600">
                                Create your first room above or join
                                an existing room using its code.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {rooms.map((room) => (
                                <Link
                                    key={room.id}
                                    to={`/rooms/${room.id}`}
                                    className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 transition hover:border-zinc-700 hover:bg-zinc-900"
                                >
                                    <div className="min-w-0">
                                        <h3 className="truncate font-medium text-zinc-200 transition group-hover:text-white">
                                            {room.name}
                                        </h3>

                                        <p className="mt-1 text-xs text-zinc-600">
                                            Room code:{" "}
                                            <span className="font-mono tracking-wider text-zinc-500">
                                                {room.code}
                                            </span>
                                        </p>
                                    </div>

                                    <span className="ml-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300">
                                        →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Home;