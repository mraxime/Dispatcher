import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type {
	permissionTable,
	sessionTable,
	userTable,
	userToPermissionJunctionTable,
} from 'src/server/database/schema';
import type {
	createUserSchema,
	loginSchema,
	passwordSchema,
	userParamsSchema,
} from 'src/validations/auth';

export type User = InferSelectModel<typeof userTable>;
export type UserInput = z.infer<typeof createUserSchema>;
export type UserParams = z.input<typeof userParamsSchema>;

export type Permission = InferSelectModel<typeof permissionTable>;

export type Session = InferSelectModel<typeof sessionTable>;
export type UserPermissionJunction = InferSelectModel<typeof userToPermissionJunctionTable>;

export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
