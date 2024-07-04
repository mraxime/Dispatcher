import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { driverLicenseTable } from 'src/server/database/schema';
import type { createDriverLicenseSchema } from 'src/validations/driver-license';

export type DriverLicense = InferSelectModel<typeof driverLicenseTable>;
export type DriverLicenseInput = z.infer<typeof createDriverLicenseSchema>;
