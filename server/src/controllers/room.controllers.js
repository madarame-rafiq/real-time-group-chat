import { createNewRoom, getUserRooms, joinRoomByCode } from "../services/room.service.js";


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

export const joinRoom = async (req, res, next) => {
    try {
        const { roomCode } = req.body;

        const room = await joinRoomByCode(roomCode, req.user.id); 

        return res.status(200).json({
            message: "You have joined the room.!!",
            room
        });

    } catch (error) {
        next(error);
    }
}

export const getRooms = async (req, res, next) => {
    try {
        const rooms = await getUserRooms(req.user.id);

        return res.status(200).json({
            rooms,
        });
    } catch (error) {
        next(error);
    }
}