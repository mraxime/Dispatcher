import { z } from 'zod';

import { isObject } from '..';

/**
 * Zod custom preprocessor to fix annoyances of form input values.
 *
 * This function resolves the common issue where form inputs, like numeric values, are received as strings.
 * It will automatically coerce all values to fit their appropriate types as defined in the passed Zod schema.
 *
 * Inspired by: https://github.com/colinhacks/zod/discussions/1860
 */
export function preprocessForm<T extends z.ZodSchema>(schema: T) {
	return z.preprocess((values) => {
		const result = transformSchema(values, schema);

		console.log('final result', result);
		return result;
	}, schema);
}

/**
 * Transform any form values to best fit a zod object schema.
 * Todo: support `FormData` to be the passed formValues?
 */
const transformSchema = <T extends z.ZodSchema>(formValues: unknown, schema: T) => {
	if (!isObject(formValues)) throw new Error(`Only object is supported.`);
	const shape = getSchemaShape(schema);
	const result = mapObj(shape, ([name, propertySchema]) => {
		const value = formValues[name];
		const transformedValue = transformValue(value, propertySchema);

		// Transform empty object to null
		if (isObject(value)) {
			let isAllNullish = true;
			for (const [key, val] of Object.entries(value)) {
				if (key === 'id') continue; // little hack needed for certain form with defaultValues
				if (key === 'company') continue; // same
				if (!val) continue;
				isAllNullish = false;
				break;
			}
			if (isAllNullish) return null;
		}

		return transformedValue;
	});

	return result;
};

/**
 * Transform a single value to best fit a zod Schema property.
 */
const transformValue = <T extends z.ZodSchema>(value: unknown, propertySchema: T): unknown => {
	// 1) Basics
	if (value === '') return null;
	if (value === null) return value;
	if (value === undefined) return value;

	// 2) coercions
	if (propertySchema instanceof z.ZodEffects) {
		return transformValue(value, propertySchema.innerType());
	}

	if (propertySchema instanceof z.ZodOptional) {
		return transformValue(value, propertySchema.unwrap());
	}

	if (propertySchema instanceof z.ZodNullable) {
		return transformValue(value, propertySchema.unwrap());
	}

	if (propertySchema instanceof z.ZodDefault) {
		const v = value ?? propertySchema._def.defaultValue();
		return transformValue(v, propertySchema.removeDefault());
	}

	if (propertySchema instanceof z.ZodArray) {
		if (!value || !Array.isArray(value)) return value; // throw new Error(`Expected array, received ${value}`);
		return value.map((v) => transformValue(v, propertySchema.element));
	}

	if (propertySchema instanceof z.ZodObject) {
		if (!isObject(value)) return value; // throw new Error(`Expected object, received ${value}`);
		return transformSchema(value, propertySchema);
	}

	if (propertySchema instanceof z.ZodString) {
		return coercions.text(value);
	}

	if (propertySchema instanceof z.ZodNumber) {
		return coercions.numeric(value);
	}

	if (propertySchema instanceof z.ZodBoolean) {
		return coercions.boolean(value);
	}

	if (propertySchema instanceof z.ZodDate) {
		return coercions.date(value);
	}

	return value;
};

/**
 * Coercions by input type.
 * Failed coercions will return the original value.
 */
const coercions = {
	text: (value: unknown) => {
		if (typeof value === 'number' && !Number.isNaN(value)) return String(value);
		return value;
	},

	numeric: (value: unknown) => {
		const newValue = Number(value);
		return Number.isNaN(newValue) ? value : newValue;
	},

	boolean: Boolean,

	date: (value: unknown) => {
		// @ts-expect-error: Won't cause any runtime error.
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date;
	},
};

/**
 * Gets the object shape of a zod Schema.
 */
const getSchemaShape = <T extends z.ZodSchema>(schema: T) => {
	let shape = schema;

	while (shape instanceof z.ZodObject || shape instanceof z.ZodEffects) {
		if (shape instanceof z.ZodObject) {
			shape = shape.shape;
			continue;
		} else if (shape instanceof z.ZodEffects) {
			shape = shape._def.schema;
			continue;
		}
		throw new Error(`Could not find shape (z.object)`);
	}

	return shape;
};

/**
 * Helper to map an object.
 * Returns a new object with the same keys, but values transformed by a callback function.
 * Edit: The object key won't be included in the new object if the callback returns `undefined`.
 */
const mapObj = <TKey extends string, TValue, TResult>(
	obj: Record<TKey, TValue>,
	cb: (entry: [TKey, TValue]) => TResult,
): Record<TKey, TResult> => {
	const result = {} as Record<TKey, TResult>;

	for (const key of Object.keys(obj)) {
		// result[key] = cb([key, obj[key]]);
		// Edit: actually, when cb returns undefined let's not include the key at all:
		const value = cb([key, obj[key]]);
		if (value !== undefined) result[key] = value;
	}

	return result;
};
