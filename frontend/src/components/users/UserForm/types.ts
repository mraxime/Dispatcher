import type { z } from 'zod';

import type { createUserSchema } from 'src/lib/schemas/user.schema';

export type UserSubmitData = z.infer<typeof createUserSchema>;
