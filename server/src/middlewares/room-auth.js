import { isRoomMember } from "../repositories/room.repositories.js";


export const requireRoomMember = async (req, res, next) => {
    try {
    
        const { roomId } = req.params;

        const isMember = await isRoomMember(roomId, req,user.id);

        if (!isMember){
            res.status(403).json({
                message: "You are not member of this room!"
            });
        }

        next();

    } catch (error) {
        next(error);
    }
}