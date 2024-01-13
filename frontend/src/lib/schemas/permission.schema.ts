import { z } from 'zod';

export const createPermissionSchema = z.object({
	id: z.number().optional(),
	action: z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE']),
	group: z.enum([
		'USER',
		'BILL',
		'CALENDAR',
		'CALL',
		'CLIENT',
		'COMPANY',
		'PRICE',
		'SERVICE',
		'TRAILER',
	]),
	description: z.string().nullish(),
});

export const updatePermissionSchema = createPermissionSchema.deepPartial();

export type CreatePermissionSchema = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionSchema = z.infer<typeof updatePermissionSchema>;
