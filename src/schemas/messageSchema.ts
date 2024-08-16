//done

import {z} from 'zod';

export const messageSchema = z.object({
    content: z
    .string()
    .min(1, "Message must not be empty")
    .max(500, "Message must be atmost 500 characters long"),
});