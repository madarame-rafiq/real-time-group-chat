import { findSessionWithUser } from "../repositories/session.repositories.js";

export const requireAuth = async (req, res, next) => {
    try {
        const sessionId = req.cookies.session_id;

        if (!sessionId) {
            return res.status(401).json({
                message: "Authentication required."
            });
        } 

  

        const session = await findSessionWithUser(sessionId);

        if (!session) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }
   
        req.user = {
            id: session.user_id,
            username: session.username
        }

        req.session = {
            id: session.session_id,
            expiresAt: session.expires_at
        }
        next();
    } catch (error) {
        next(error);
    }
}