import { isRoomMember } from "../repositories/room.repositories.js";


export const registerRoomHandler = (io, socket) => {
    socket.on("room:join", async({ roomId }, callback) => {
        try {
            
            const isMember = await isRoomMember(roomId, secoket.user.id);

            if (!isMember) {
                callback({
                    success: false,
                    message: 'You are not member of this group.'
                });
            }

            await socket.join(roomId);

            callback({
                success: true,
                message: 'Joined the room successfully.'
            });

        } catch (error) {
            console.log(`Error joining room: `, error);

            callback({
                success: false,
                message: "Unable to join room."
            });
        }
    });

    socket.on("room:leave", async ({ roomId }, callback) => {
        try {
            await socket.leave(roomId);

            callback({
                success: true,
                message: "left the room successfully."
            });
        } catch (error) {
            console.log(`Room leeaving error: ${error}`);
            callback({
                success: false,
                message: 'Unable to leave the room.'
            });
        }


    });
}