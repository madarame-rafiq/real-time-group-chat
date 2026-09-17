import express from 'express';
import cors from 'cors';

//routes
import authRouter from './routes/auth.routes.js'
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

app.use('/auth', authRouter);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'The chat server is healthy!',
    });
});

app.use(errorHandler);

export default app;