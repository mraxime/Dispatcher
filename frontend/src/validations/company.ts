import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { COMPANY_STATUS } from 'src/constants/company';
import { companyTable } from 'src/server/database/schema';

export const createCompanySchema = createInsertSchema(companyTable);
export const updateCompanySchema = createCompanySchema.deepPartial();

export const companyParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
		status: z.enum(COMPANY_STATUS).default('active'),
	})
	.default({});
