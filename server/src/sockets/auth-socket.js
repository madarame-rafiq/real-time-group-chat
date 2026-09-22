import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { parseCookie } = require("cookie");
 
import { findSessionWithUser } from "../repositories/session.repositories.js";

export const authenticateSession = async (socket, next) => {
    try {
        // console.log("parse type:", typeof parse);  // should print "function"   
        const cookies = parseCookie(
            socket.handshake.headers.cookie || ""
        );

        const sessionId = cookies.session_id;

        if (!sessionId) {
            return next(
                new Error("Authentication required")
            );
        }

        const session = await findSessionWithUser(sessionId);

        if (!session) {
            return next(
                new Error("Invalid or expired session")
            );
        }

        socket.user = {
            id: session.user_id,
            username: session.username,
        };

        socket.session = {
            id: session.session_id,
            expiresAt: session.expires_at,
        };

        next();
    } catch (error) {
        next(error);
    }
};