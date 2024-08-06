import type { z } from 'zod';

import type { createUserSchema } from 'src/lib/schemas/users';

export type UserSubmitData = z.infer<typeof createUserSchema>;
