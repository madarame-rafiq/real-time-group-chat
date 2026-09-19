import { isRoomMember } from "../repositories/room.repositories";
import { createRoomMessage } from "../services/message.service";


export const registerMessageHandler = async (io, socket) => {
    socket.on("message:send", async ({ roomId, content }, callback) => {
        try {
            
            const isMember = await isRoomMember(roomId, socket.user.id);

            if (!isMember) {
                callback({
                    success: false,
                    message: 'You are not a member of the room',
                });
            }

            const message = await createRoomMessage(roomId, socket.user.id, content);

            io.to(roomId).emit("message:new", message);

            callback({
                success: true,
                message: 'Message sent succesfully'
            });

        } catch (error) {
            console.log(`Error sending the message: ${error}`);

            callback({
                success: false,
                message: 'Unable to send message'
            });
        }
    });
    
}