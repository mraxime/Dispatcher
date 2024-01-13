import type { z } from 'zod';

import type { createClientSchema } from 'src/lib/schemas/client.schema';

export type ClientSubmitData = z.infer<typeof createClientSchema>;
