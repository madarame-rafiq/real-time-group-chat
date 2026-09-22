const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export const registerUser = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            username,
            password,
        }),
    });

    return handleResponse(response);
};

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            username,
            password,
        }),
    });

    return handleResponse(response);
};

export const getCurrentUser = async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
    });

    return handleResponse(response);
};

export const logoutUser = async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    return handleResponse(response);
};