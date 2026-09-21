const API_URL = "http://localhost:5000/api";

const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export const getRooms = async () => {
    const response = await fetch(`${API_URL}/rooms`, {
        credentials: "include",
    });

    return handleResponse(response);
};

export const createRoom = async (name) => {
    const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name }),
    });

    return handleResponse(response);
};

export const joinRoom = async (code) => {
    const response = await fetch(`${API_URL}/rooms/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
    });

    return handleResponse(response);
};