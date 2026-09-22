import { z } from "zod";

export const getMessagesSchema = z.object({
    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(50),

    before: z
        .string()
        .datetime({ offset: true })
        .optional(),
});

export const sendMessageSchema = z.object({
    roomId: z.string().uuid("Invalid room ID"),

    content: z
        .string()
        .trim()
        .min(1, "Message cannot be empty")
        .max(2000, "Message cannot exceed 2000 characters"),
});