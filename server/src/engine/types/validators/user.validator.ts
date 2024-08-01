import z from 'zod';

export const UserValidator = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  name: z.string().optional(),
});
