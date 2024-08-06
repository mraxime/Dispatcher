import type { z } from 'zod';

import type { updateUserProfileSchema } from 'src/lib/schemas/users';

export type UserProfileSubmitData = z.infer<typeof updateUserProfileSchema>;
