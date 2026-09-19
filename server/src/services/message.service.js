import { createMessage, findMessagesByRoomId } from "../repositories/message.repositories.js"

export const getAllRoomMessages = async (roomId, limit, begin) => {
    const messages = await findMessagesByRoomId(roomId, limit, begin);

    return messages.reverse();
}

export const createRoomMessage = async (room_id, sender_id, content) => {
    return await createMessage(room_id, sender_id, content);
}