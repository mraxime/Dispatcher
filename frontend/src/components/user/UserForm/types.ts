import type { z } from 'zod';
import type { createUserSchema } from 'src/validations/auth';

export type UserSubmitData = z.infer<typeof createUserSchema>;
