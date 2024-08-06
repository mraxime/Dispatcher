import type { z } from 'zod';

import type { createClientSchema } from 'src/lib/schemas/clients';

export type ClientSubmitData = z.infer<typeof createClientSchema>;
