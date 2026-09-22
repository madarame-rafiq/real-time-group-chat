import express from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { joinRoomSchema, roomNameSchema } from '../validators/room.validators.js';
import { createRoom, getRooms, joinRoom, leaveRoom } from '../controllers/room.controllers.js';


const router = express.Router();

router.post('/', requireAuth, validate(roomNameSchema), createRoom);

router.post('/join', requireAuth, validate(joinRoomSchema), joinRoom);

router.get('/rooms', requireAuth, getRooms);

router.delete('/:roomId', requireAuth, leaveRoom);

export default router;