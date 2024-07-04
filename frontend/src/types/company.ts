import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { companyTable } from 'src/server/database/schema';
import type { companyParamsSchema, createCompanySchema } from 'src/validations/company';

export type Company = InferSelectModel<typeof companyTable>;
export type CompanyInput = z.infer<typeof createCompanySchema>;
export type CompanyParams = z.input<typeof companyParamsSchema>;
