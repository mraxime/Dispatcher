import type { z } from 'zod';

import type { createTrailerSchema } from 'src/lib/schemas/trailers';

export type TrailerSubmitData = z.infer<typeof createTrailerSchema>;
