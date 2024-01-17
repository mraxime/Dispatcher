import type { ReadonlyURLSearchParams } from 'next/navigation';

export * from './currencies';
export * from './measures';

/**
 * Check if a value is a pure object.
 * This is better than `typeof value === 'object'`.
 */
export const isObject = (value: unknown): value is Record<string, unknown> =>
	value?.constructor === Object;

/**
 * Deeply merge two objects together.
 */
export const deepMerge = <T extends object>(obj1: T, obj2: T): T => {
	const output = Object.assign({}, obj1);

	for (const key in obj2) {
		if (Object.prototype.hasOwnProperty.call(obj2, key)) {
			output[key] =
				typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]
					? deepMerge(obj1[key], obj2[key])
					: obj2[key];
		}
	}

	return output;
};

export const getInitials = (name = '') =>
	name
		.replace(/\s+/, ' ')
		.split(' ')
		.slice(0, 2)
		.map((v) => v?.[0].toUpperCase())
		.join('');

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
	const paramsString = params.toString();
	const queryString = `${paramsString.length > 0 ? '?' : ''}${paramsString}`;

	return `${pathname}${queryString}`;
};
