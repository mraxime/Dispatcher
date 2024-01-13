import type { z } from 'zod';

import type { createTrailerSchema } from 'src/lib/schemas/trailer.schema';

export type TrailerSubmitData = z.infer<typeof createTrailerSchema>;
