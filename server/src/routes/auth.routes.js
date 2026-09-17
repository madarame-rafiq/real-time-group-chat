import express from 'express';
import { register } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema } from '../validators/auth.validators.js';


const router = express.Router();

router.post('/register', validate(registerSchema) ,register);

export default router;