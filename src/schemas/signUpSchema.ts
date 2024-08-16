//done

import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(3, "Username must be atleast 3 characters long")
    .max(30, "Username must be atmost 30 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only alphabets and numbers");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message:"Password must be atleast 8 characters long"}),
});
