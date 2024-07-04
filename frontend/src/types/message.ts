import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { messageTable } from 'src/server/database/schema';
import type { createMessageSchema, messageParamsSchema } from 'src/validations/message';

export type Message = InferSelectModel<typeof messageTable>;
export type MessageInput = z.infer<typeof createMessageSchema>;
export type MessageParams = z.input<typeof messageParamsSchema>;
