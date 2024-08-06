import { z } from 'zod';

// Expected values to coerce.
const stringlike = z.string().optional();
const numberlike = z.union([z.number(), z.string()]).optional();
const datelike = z.union([z.number(), z.string(), z.date()]).optional();

/**
 * Coercions by input type.
 * Treat empty string from html input value as null.
 */
const coercions = {
	text: (value: unknown) => {
		if (value === '') return null;
		return value;
	},

	numeric: (value: unknown) => {
		if (value === '') return null;
		const newValue = Number(value);
		return Number.isNaN(newValue) ? value : newValue;
	},

	date: (value: unknown) => {
		// @ts-expect-error - won't cause any runtime error.
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return null;
		return date;
	},
};

/**
 * Adapt a zod schema to work flawlessly with html input values.
 */
export const zFormInput = {
	text: <T extends z.ZodSchema>(schema: T) => {
		return stringlike.transform(coercions.text).pipe(schema);
	},

	numeric: <T extends z.ZodSchema>(schema: T) => {
		return numberlike.transform(coercions.numeric).pipe(schema);
	},

	date: <T extends z.ZodSchema>(schema: T) => {
		return datelike.transform(coercions.date).pipe(schema);
	},
};
