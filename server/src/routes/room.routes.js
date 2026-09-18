import express from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { roomNameSchema } from '../validators/room.validators.js';
import { createRoom } from '../controllers/room.controllers.js';


const router = express.Router();

router.post('/', requireAuth, validate(roomNameSchema), createRoom);

export default router;