import type { z } from 'zod';

import type { createCompanySchema } from 'src/lib/schemas/companies';

export type CompanySubmitData = z.infer<typeof createCompanySchema>;
