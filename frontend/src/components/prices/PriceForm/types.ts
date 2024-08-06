import type { z } from 'zod';

import type { createPriceSchema } from 'src/lib/schemas/prices';

export type PriceSubmitData = z.infer<typeof createPriceSchema>;
