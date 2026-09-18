import { createNewRoom } from "../services/room.service.js";


export const createRoom = async (req, res, next) => {
    try {
        const { roomName } = req.body;

        const room = await createNewRoom(req.user.id, roomName);

        return res.status(201).json({
            message: 'The room has been created',
            room,
        });
    } catch (error) {
        next(error);
    }    
}