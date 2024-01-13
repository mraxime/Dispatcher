import type { z } from 'zod';

import type { passwordUpdateSchema } from 'src/lib/schemas/user.schema';

export type UserPasswordSubmitData = z.infer<typeof passwordUpdateSchema>;
