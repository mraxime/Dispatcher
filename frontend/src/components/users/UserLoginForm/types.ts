import type { z } from 'zod';

import type { loginSchema } from 'src/lib/schemas/users';

export type UserLoginSubmitData = z.infer<typeof loginSchema>;
