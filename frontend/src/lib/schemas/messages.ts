import { z } from 'zod';

export const createMessageSchema = z.object({
	id: z.number().optional(),
	content: z.string().min(1),
	sender: z.string().min(1),
	receiver: z.string().min(1),
	file: z.string().min(1).nullish(),
});

export const updateMessageSchema = createMessageSchema.deepPartial();

export type CreateMessageSchema = z.infer<typeof createMessageSchema>;
export type UpdateMessageSchema = z.infer<typeof updateMessageSchema>;
