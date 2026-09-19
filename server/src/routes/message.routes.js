import express from 'express'
import { requireAuth } from '../middlewares/auth.js';
import { requireRoomMember } from '../middlewares/room-auth.js';
import { validate } from '../middlewares/validate.js';
import { getMessagesSchema } from '../validators/message.validator.js';
import { getMessages } from '../controllers/message.controller.js';



const router = express.Router();

router.get('/rooms/:roomId/messages', requireAuth, requireRoomMember, validate(getMessagesSchema), getMessages);