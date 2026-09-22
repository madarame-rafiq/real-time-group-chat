
import { deleteSession } from "../repositories/session.repositories.js";
import { loginUser, registerUser } from "../services/auth.services.js";

export const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const newlyCreatedUser = await registerUser(username, password);
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newlyCreatedUser,
        });
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        
        const { username, password } = req.body;

        const { user, session } = await loginUser(username, password);
        // console.log(session)

        // res.cookie("session_id", session.id, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "lax",
        //     path: "/",
        //     expires: new Date(session.expires_at),
        // });

        res.cookie("session_id", session.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            expires: new Date(session.expires_at),
        });

        res.status(200).json({
            message: "Login successfully",
            user,
        });

    } catch (error) {
        if (error.message === 'Wrong username or password') {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
}

export const getMe = async (req, res) => {
   
    return res.status(200).json({
        user: req.user
    });
} 

export const logout = async (req, res) => {
    try {
        await deleteSession(req.session.id);
    
        res.clearCookie("session_id", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    
        return res.status(200).json({
            message: "Logout succesfully!"
        });
    } catch (error) {
        next(error);
    }
}