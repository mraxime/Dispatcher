import { z } from 'zod';

import { createContactSchema } from './contact';
import { createDriverLicenseSchema } from './driver-license';

export type NewUserForm = z.infer<typeof createUserSchema>;

export const loginSchema = z.object({
	email: z.string({ required_error: 'Courriel requis' }).email('Courriel non valide'),
	password: z.string({ required_error: 'Mot de passe requis' }),
	rememberMe: z.coerce.boolean().default(false),
});

export const passwordUpdateSchema = z
	.object({
		password: z.string().min(7, 'Doit avoir au moins 7 charactères'),
		passwordConfirm: z.string().min(1),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Les mots de passes doivent être identiques',
		path: ['passwordConfirm'],
	});

export const createUserSchema = z
	.object({
		id: z.string().optional(),
		company: z.number().nullish(), // company.id
		first_name: z.string().min(1),
		last_name: z.string().min(1),
		role: z.string().min(1).optional(/* will default to public role */), // or createRoleSchema ?
		permissions: z.array(z.number()).default([]), // or createPermisionSchema ?
		email: z.string().min(1).email('Courriel non valide'),
		phone: z.string(),
		ext: z.string().nullish(),
		birthday: z.date().nullish(),
		hireday: z.date().nullish(),
		password: z.preprocess(
			(value) => (value === null ? undefined : value),
			z.string().min(7, 'Doit avoir au moins 7 charactères').optional(),
		),
		passwordConfirm: z.preprocess(
			(value) => (value === null ? undefined : value),
			z.string().min(1).optional(),
		),
		blocked: z.coerce.boolean().default(false),
		emergency_contact: createContactSchema.nullish(),
		driver_license: createDriverLicenseSchema.nullish(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Les mots de passes doivent être identiques',
		path: ['passwordConfirm'],
	});

export const updateUserSchema = createUserSchema
	.innerType()
	.deepPartial()
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Les mots de passes doivent être identiques',
		path: ['passwordConfirm'],
	});

export const updateUserProfileSchema = z
	.object({
		first_name: z.string().min(1).optional(),
		last_name: z.string().min(1).optional(),
		email: z.string().min(1).email('Courriel non valide').optional(),
		phone: z.string().nullish(),
		ext: z.string().nullish(),
		birthday: z.date().nullish(),
		hireday: z.date().nullish(),
		password: z.string().min(7, 'Doit avoir au moins 7 charactères').optional(),
		passwordConfirm: z.string().min(1).optional(),
		// emergency_contact: z.number().nullish(),
		// driver_license: z.number().nullish(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Les mots de passes doivent être identiques',
		path: ['passwordConfirm'],
	});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UpdateUserProfileSchema = z.infer<typeof updateUserSchema>;
