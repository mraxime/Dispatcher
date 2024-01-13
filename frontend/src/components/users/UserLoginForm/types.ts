import type { z } from 'zod';

import type { loginSchema } from 'src/lib/schemas/user.schema';

export type UserLoginSubmitData = z.infer<typeof loginSchema>;
