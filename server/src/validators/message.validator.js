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