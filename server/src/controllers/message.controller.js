import { getAllRoomMessages } from "../services/message.service.js";


export const getMessages = async (req, res, next) => {
    try {
        
        const { roomId } = req.params;
        const { limit=50, begin } = req.query;
        const messages = await getAllRoomMessages(roomId, Number(limit), begin || null);

        return res.status(200).json({
            messages,
        });

    } catch (error) {
        next(error);
    }
}