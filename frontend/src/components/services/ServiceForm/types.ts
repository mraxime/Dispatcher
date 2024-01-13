import type { z } from 'zod';

import type { createServiceSchema } from 'src/lib/schemas/service.schema';

export type ServiceSubmitData = z.infer<typeof createServiceSchema>;
