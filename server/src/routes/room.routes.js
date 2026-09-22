import express from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { joinRoomSchema, roomNameSchema } from '../validators/room.validators.js';
import { createRoom, getRoom, getRooms, joinRoom, leaveRoom } from '../controllers/room.controllers.js';
import { requireRoomMember } from '../middlewares/room-auth.js';
import { roomRateLimiter } from '../middlewares/rate-limit.js';


const router = express.Router();

router.post('/', roomRateLimiter, requireAuth, validate(roomNameSchema), createRoom);

router.post('/join', roomRateLimiter, requireAuth, validate(joinRoomSchema), joinRoom);

router.get('/rooms', requireAuth, getRooms);

router.get(
    "/:roomId",
    requireAuth,
    requireRoomMember,
    getRoom
);

router.delete('/:roomId', requireAuth, leaveRoom);

export default router;