import { z } from 'zod';

import type { MessageParams } from '../types/directus';

export const createMessageSchema = z.object({
	id: z.number().optional(),
	company: z.number(), // company.id
	content: z.string().min(1),
	sender: z.string().min(1),
	receiver: z.string().min(1),
	file: z.string().min(1).nullish(),
});

export const updateMessageSchema = createMessageSchema.deepPartial();

export type CreateMessageSchema = z.infer<typeof createMessageSchema>;
export type UpdateMessageSchema = z.infer<typeof updateMessageSchema>;

export const messageParamsSchema = (() => {
	return {
		/** Translates a flatten URL searchParams object into `MessageParams`. */
		parseSearchParams: (params: Record<string, string>): MessageParams => {
			const result = {
				page: Number(params.page ?? 1),
				limit: Number(params.limit ?? 10),
				search: params.search ?? '',
			};
			return result;
		},

		/** Translates `MessageParams` into a flatten URL searchParams object. */
		createSearchParams: (params: MessageParams): Record<string, string> => {
			const result: Record<string, string> = {};
			if (params.page && params.page !== 1) result.page = String(params.page);
			if (params.limit && params.limit !== 10) result.limit = String(params.limit);
			if (params.search) result.search = params.search;
			return result;
		},
	};
})();
