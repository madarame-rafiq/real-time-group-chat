import { findMessagesByRoomId } from "../repositories/message.repositories.js"

export const getAllRoomMessages = async (roomId, limit, begin) => {
    const messages = await findMessagesByRoomId(roomId, limit, begin);

    return messages.reverse();
}