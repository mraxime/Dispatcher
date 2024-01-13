import type { z } from 'zod';

import type { createCompanySchema } from 'src/lib/schemas/company.schema';

export type CompanySubmitData = z.infer<typeof createCompanySchema>;
