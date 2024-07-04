import type { ReadonlyURLSearchParams } from 'next/navigation';

export * from './currencies';
export * from './measures';

/**
 * Check if a value is a pure object.
 * This is better than `typeof value === 'object'`.
 */
export const isObject = (value: unknown): value is Record<string, unknown> =>
	value?.constructor === Object;

export const getInitials = (name = '') =>
	name
		.replace(/\s+/, ' ')
		.split(' ')
		.slice(0, 2)
		.map((v) => v[0]?.toUpperCase())
		.join('');

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
	const paramsString = params.toString();
	const queryString = `${paramsString.length > 0 ? '?' : ''}${paramsString}`;

	return `${pathname}${queryString}`;
};
