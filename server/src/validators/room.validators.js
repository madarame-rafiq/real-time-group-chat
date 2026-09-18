import { z } from 'zod';

export const roomNameSchema = z.object({
    roomName: z
        .string()
        .trim()
        .min(1, "Room name is required!")
        .max(100, "Room name cannot be longer than 100 characters!")
});