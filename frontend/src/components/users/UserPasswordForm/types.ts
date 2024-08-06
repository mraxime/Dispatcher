import type { z } from 'zod';

import type { passwordUpdateSchema } from 'src/lib/schemas/users';

export type UserPasswordSubmitData = z.infer<typeof passwordUpdateSchema>;
