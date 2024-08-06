/* eslint-disable unicorn/no-lonely-if */
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { preprocessForm } from './zod-form';

/**
 * Same as normal zodResolver but preprocess the passed schema to fix form values anoyances.
 */
export const zodResolverEnhanced = <T extends z.ZodSchema>(schema: T) =>
	zodResolver(preprocessForm(schema));

/**
 * Error map for zod schemas.
 */
export const zodCustomErrorMap: z.ZodErrorMap = (issue, ctx) => {
	if (issue.code === z.ZodIssueCode.invalid_type) {
		if (issue.expected === 'string') return { message: 'Champs requis' };
		if (issue.expected === 'number') return { message: 'Champs requis' };
		if (issue.expected === 'object') return { message: 'Champs requis' };
		if (issue.expected === 'integer') return { message: 'Nombre entier seulement' };
	}

	if (issue.code === z.ZodIssueCode.invalid_date) {
		return { message: 'Date invalide' };
	}

	if (issue.code === z.ZodIssueCode.too_big) {
		return { message: `Maximum dépassé (max: ${issue.maximum})` };
	}

	if (issue.code === z.ZodIssueCode.too_small) {
		if (issue.type === 'string' && issue.minimum === 1) return { message: 'Champs requis' };
		return { message: `Minimum non atteint (min: ${issue.minimum})` };
	}

	return { message: ctx.defaultError };
};

z.setErrorMap(zodCustomErrorMap);
