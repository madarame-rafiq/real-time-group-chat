import { z } from 'zod';


export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, 'Username must atleast be 3 characters long!')
        .max(30, 'Username cannot be longer than 30 characters long!'),
    
    password: z
        .string()
        .min(8, 'Password must atleast be 8 characters long!')
        .max(72, 'Password cannot be longer thatn 72 characters!')

});

export const loginSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, 'Username must atleast be 3 characters long!')
        .max(30, 'Username cannot be longer than 30 characters long!'),
    
    password: z
        .string()
        .min(8, 'Password must atleast be 8 characters long!')
        .max(72, 'Password cannot be longer thatn 72 characters!')
});