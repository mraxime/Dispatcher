import { createInsertSchema } from 'drizzle-zod';
import { driverLicenseTable } from 'src/server/database/schema';

export const createDriverLicenseSchema = createInsertSchema(driverLicenseTable);
export const updateDriverLicenseSchema = createDriverLicenseSchema.deepPartial();
