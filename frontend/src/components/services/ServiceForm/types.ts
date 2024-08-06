import type { z } from 'zod';

import type { createServiceSchema } from 'src/lib/schemas/services';

export type ServiceSubmitData = z.infer<typeof createServiceSchema>;
