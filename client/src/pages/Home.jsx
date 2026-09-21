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
        <main>
            <header>
                <div>
                    <h1>Chat</h1>
                    <p>Welcome, {user.username}</p>
                </div>

                <button onClick={logout}>
                    Logout
                </button>
            </header>

            {error && <p>{error}</p>}

            <section>
                <h2>Create a room</h2>

                <form onSubmit={handleCreateRoom}>
                    <input
                        value={roomName}
                        onChange={(event) =>
                            setRoomName(event.target.value)
                        }
                        placeholder="Room name"
                        disabled={creating}
                    />

                    <button
                        type="submit"
                        disabled={creating}
                    >
                        {creating
                            ? "Creating..."
                            : "Create room"}
                    </button>
                </form>
            </section>

            <section>
                <h2>Join a room</h2>

                <form onSubmit={handleJoinRoom}>
                    <input
                        value={roomCode}
                        onChange={(event) =>
                            setRoomCode(event.target.value)
                        }
                        placeholder="Room code"
                        maxLength={6}
                        disabled={joining}
                    />

                    <button
                        type="submit"
                        disabled={joining}
                    >
                        {joining
                            ? "Joining..."
                            : "Join room"}
                    </button>
                </form>
            </section>

            <section>
                <h2>Your rooms</h2>

                {loading ? (
                    <p>Loading rooms...</p>
                ) : rooms.length === 0 ? (
                    <p>You haven't joined any rooms yet.</p>
                ) : (
                    <div>
                        {rooms.map((room) => (
                            <Link
                                key={room.id}
                                to={`/rooms/${room.id}`}
                            >
                                <div>
                                    <h3>{room.name}</h3>
                                    <p>{room.code}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Home;