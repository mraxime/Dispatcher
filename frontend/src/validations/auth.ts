import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { USER_ROLES, USER_STATUS } from 'src/constants/user';
import { userTable } from 'src/server/database/schema';
import { createDriverLicenseSchema } from './driver-license';

export const createUserSchema = createInsertSchema(userTable, {
	username: (schema) => schema.username.trim().toLowerCase(),
	email: (schema) => schema.email.trim().toLowerCase(),
	password: (schema) =>
		z.preprocess(
			(value) => (value === null ? undefined : value),
			schema.password.min(7, { message: 'Doit contenir au moins 7 charactères' }).optional(),
		),
})
	.extend({
		passwordConfirm: z.preprocess(
			(value) => (value === null ? undefined : value),
			z.string().min(1).optional(),
		),
		permissions: z.array(z.string()).default([]),
		driverLicense: createDriverLicenseSchema.omit({ userId: true }).optional(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.passwordConfirm) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Les mots de passes doivent être identiques',
				path: ['passwordConfirm'],
			});
		}
	});

export const updateUserSchema = createUserSchema
	.innerType()
	.deepPartial()
	.superRefine((data, ctx) => {
		if (data.password !== data.passwordConfirm) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Les mots de passes doivent être identiques',
				path: ['passwordConfirm'],
			});
		}
	});

export const userParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
		search: z.string().optional(),
		status: z.enum(USER_STATUS).optional(),
		role: z.enum(['all', ...USER_ROLES]).default('all'),
	})
	.default({});

export const loginSchema = z.object({
	username: z.string({ required_error: 'Identifiant requis' }).trim().toLowerCase(),
	password: z.string({ required_error: 'Mot de passe requis' }),
	rememberMe: z.coerce.boolean().default(false),
});

export const passwordSchema = createUserSchema
	.innerType()
	.pick({ password: true, passwordConfirm: true })
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Les mots de passes doivent être identiques',
		path: ['passwordConfirm'],
	});
