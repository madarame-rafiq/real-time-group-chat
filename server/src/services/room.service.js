import { addRoomMember, createNewRoomWithMember, findRoomByCode, findRoomByUserId, findRoomMember } from "../repositories/room.repositories.js";


const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321';
    let code = '';

    for(let i = 0; i < 6; ++i) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }
    return code;
}

export const createNewRoom = async (userId, name) => {
    for (let attempt = 0; attempt < 5; ++attempt) {
        const code = generateRandomCode();

        try {
            return await createNewRoomWithMember(code, name, userId);
        } catch (error) {
            if (error.code === "23505") continue;
                throw error
        }
    }
    throw new Error("Unable to generate a unique room code");
}

export const joinRoomByCode = async (code, userId) => {
    const roomExists = await findRoomByCode(code);

    if (!code) {
        const error = new Error("The room does not exists");
        error.statusCode = 404;
        throw error;
    }

    const alreadyMember = await findRoomMember(roomExists.id, userId);

    if (alreadyMember) {
        return roomExists
    }

    await addRoomMember(roomExists.id, userId);
    return roomExists;
}

export const getUserRooms = async (userId) => {
    return await findRoomByUserId(userId);
} 