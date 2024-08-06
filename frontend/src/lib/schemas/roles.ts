import { z } from 'zod';

export const createRoleSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
});

export const updateRoleSchema = createRoleSchema.deepPartial();

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;
