import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { contactTable } from 'src/server/database/schema';
import type { contactParamsSchema, createContactSchema } from 'src/validations/contact';

export type Contact = InferSelectModel<typeof contactTable>;
export type ContactInput = z.infer<typeof createContactSchema>;
export type ContactParams = z.input<typeof contactParamsSchema>;
