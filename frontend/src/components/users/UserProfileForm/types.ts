import type { z } from 'zod';

import type { updateUserProfileSchema } from 'src/lib/schemas/user.schema';

export type UserProfileSubmitData = z.infer<typeof updateUserProfileSchema>;
