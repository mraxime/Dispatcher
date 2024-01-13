import type { z } from 'zod';

import type { createCallSchema } from 'src/lib/schemas/call.schema';

export type CallSubmitData = z.infer<typeof createCallSchema>;
