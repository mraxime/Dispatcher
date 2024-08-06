import type { z } from 'zod';

import type { createCallSchema } from 'src/lib/schemas/calls';

export type CallSubmitData = z.infer<typeof createCallSchema>;
