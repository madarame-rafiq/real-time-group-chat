const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export const getRoomMessages = async (roomId) => {
    const response = await fetch(
        `${API_URL}/messages/rooms/${roomId}/`,
        {
            credentials: "include",
        }
    );

    const data = await handleResponse(response);

    return data.messages;
};