
import { z } from 'zod';

export const UserProfileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  income: z.coerce.number().positive({ message: "Income must be a positive number." }),
  terms: z.boolean().refine(val => val, { message: "You must accept the terms and conditions." })
});

export type UserProfileFormInput = z.infer<typeof UserProfileFormSchema>;
