import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { createUrl } from 'src/lib/utils';

/**
 * Same as Next.js `useSearchParams`, but with aditional features.
 */
export const useCustomSearchParams = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const set = useCallback(
		/**
		 * Updates a specific URL `searchParams`.
		 * If the value is null or empty, it gets removed.
		 */
		(key: string, value: string | number | boolean | null) => {
			const newParams = new URLSearchParams(searchParams);

			if (value === null || value === '') newParams.delete(key);
			else newParams.set(key, String(value));

			// Rerender the current page with the new searchParams
			router.replace(createUrl(pathname, newParams));
		},
		[router, pathname, searchParams],
	);

	const reset = useCallback(
		/**
		 * Resets the current URL's `searchParams`.
		 * An optional key-value object can be passed to represent the new `searchParams`.
		 */
		(newValues?: Record<string, string | number | boolean | null>) => {
			const newParams = new URLSearchParams();

			if (newValues) {
				for (const [key, value] of Object.entries(newValues)) {
					if (value === null || value === '') newParams.delete(key);
					else newParams.set(key, String(value));
				}
			}

			// Rerender the current page with the new searchParams
			router.replace(createUrl(pathname, newParams));
		},
		[router, pathname, searchParams],
	);

	return { value: searchParams, set, reset };
};
