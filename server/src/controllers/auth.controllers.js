
import { registerUser } from "../services/auth.services.js";

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