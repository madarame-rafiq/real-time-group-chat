import express from 'express';
import { getMe, login, logout, register } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';
import { requireAuth } from '../middlewares/auth.js';
import { authRateLimiter } from '../middlewares/rate-limit.js';


const router = express.Router();

router.post('/register', authRateLimiter, validate(registerSchema) ,register);

router.post('/login', authRateLimiter, validate(loginSchema), login);

router.get('/me', requireAuth, getMe);

router.post('/logout', requireAuth, logout);

export default router;