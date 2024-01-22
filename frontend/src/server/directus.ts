import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import {
	authentication,
	createDirectus,
	rest,
	staticToken,
	type AuthenticationStorage,
} from '@directus/sdk';

import type { DirectusSchema } from 'src/lib/types/directus';

/**
 * Creates a client that can communicate with our backend REST API (Directus).
 * Note: It uses Next.js `cookies()` as it's storage so this only work in Server Components.
 */
export const createDirectusApi = () => {
	const directus = createDirectus<DirectusSchema>(process.env.NEXT_PUBLIC_DIRECTUS_URL ?? '')
		.with(rest({ credentials: 'include' }))
		.with(authentication('json', { storage: directusAuthStorageHandler() }));

	return directus;
};

/**
 * Same as `createDirectusApi` but without authentification logic.
 * This version has access to ALL operations. Do not use outside of server runtime.
 */
export const createFullAccessDirectusApi = () => {
	const directus = createDirectus<DirectusSchema>(process.env.NEXT_PUBLIC_DIRECTUS_URL ?? '')
		.with(rest({ credentials: 'include' }))
		.with(staticToken(process.env.DIRECTUS_TOKEN!));

	return directus;
};

/**
 * Custom Auth Storage for Directus SDK to work correctly with Next.js cookies.
 * Without this, default behavious would save tokens in current environment storage,
 * but that would causes issues with nextjs ssr and hydration.
 */
const directusAuthStorageHandler = (): AuthenticationStorage => {
	const cookiesStore = cookies();

	return {
		get() {
			const access_token = cookiesStore.get('access_token')?.value ?? null;
			const refresh_token = cookiesStore.get('refresh_token')?.value ?? null;
			const expires_at = cookiesStore.get('expires_at')?.value ?? null;
			const expires = cookiesStore.get('expires')?.value ?? null;

			return {
				access_token,
				refresh_token,
				expires_at: expires_at ? Number(expires_at) : null,
				expires: expires ? Number(expires) : null,
			};
		},

		set(data) {
			const cookieOptions: Partial<ResponseCookie> = {
				path: '/',
				httpOnly: false,
				sameSite: 'none', // TODO: investigate why 'Lax' seems to cause issues
				// secure: true, // TODO: activate this when pushed online for chrome to work with sameSite=None
			};

			if (data?.access_token) {
				cookiesStore.set('access_token', data.access_token, cookieOptions);
			} else if (data?.access_token === null) {
				cookiesStore.delete('access_token');
			}

			if (data?.refresh_token) {
				cookiesStore.set('refresh_token', data.refresh_token, cookieOptions);
			} else if (data?.refresh_token === null) {
				cookiesStore.delete('refresh_token');
			}

			if (data?.expires_at) {
				cookiesStore.set('expires_at', String(data.expires_at), cookieOptions);
			} else if (data?.refresh_token === null) {
				cookiesStore.delete('expires_at');
			}

			if (data?.expires) {
				cookiesStore.set('expires', String(data.expires), cookieOptions);
			} else if (data?.refresh_token === null) {
				cookiesStore.delete('expires');
			}
		},
	};
};
