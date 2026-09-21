import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/auth.api";
import { socketConnect, socketDisconnect } from "../socket/socket-manager";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const restoreCurrentSession = useCallback(async () => {
        try {
            const data = await getCurrentUser();
            setUser(data.user);
            socketConnect();
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        restoreCurrentSession();
    }, [restoreCurrentSession]);

    const login = async (username, password) => {
        const data = await loginUser(username, password);
        setUser(data.user);
        socketConnect();
        return data;
    }
    const register = async (username, password) => {
        return await registerUser(username, password);
    }
    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(false);
            socketDisconnect();
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            { children }
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("Auth Cotext must be access inside the provider.");
    }
    return context
}