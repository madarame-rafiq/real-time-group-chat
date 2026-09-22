import { isRoomMember } from "../repositories/room.repositories.js";
import { createRoomMessage } from "../services/message.service.js";
import { sendMessageSchema } from "../validators/message.validator.js";


export const registerMessageHandler = async (io, socket) => {
    socket.on("message:send", async (payload, callback) => {
        try {
            // console.log("socker user? ", socket.user);

            const result = sendMessageSchema.safeParse(payload);

            const { roomId, content } = payload;

            if (!result.success) {
                return callback({
                    success: false,
                    message:
                        result.error.issues[0].message,
                });
            }


            const isMember = await isRoomMember(roomId, socket.user.id);
            console.log(isMember);

            if (!isMember) {
                callback({
                    success: false,
                    message: 'You are not a member of the room',
                });
                return;
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