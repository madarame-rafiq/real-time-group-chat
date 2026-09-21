import express from 'express';
import cors from 'cors';
// import 'dotenv/config.js'
import cookieParser from 'cookie-parser'

//routes
import authRouter from './routes/auth.routes.js'
import roomRouter from './routes/room.routes.js'
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);

app.use('/rooms', roomRouter);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'The chat server is healthy!',
    });
});

app.use(errorHandler);

export default app;