export const getRoomMessages = async (roomId) => {
    const response = await fetch(
        `http://localhost:5000/api/rooms/${roomId}/messages`,
        {
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load messages");
    }

    return data.messages;
};