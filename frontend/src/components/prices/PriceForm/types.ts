import type { z } from 'zod';

import type { createPriceSchema } from 'src/lib/schemas/price.schema';

export type PriceSubmitData = z.infer<typeof createPriceSchema>;
