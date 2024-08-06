import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
	authentication,
	createDirectus,
	readMe,
	rest,
	type AuthenticationStorage,
} from '@directus/sdk';

import { ROUTES } from 'src/lib/constants/routes';
import type { DirectusSchema } from 'src/lib/types/directus';

export const createDirectusServerClient = () => {
	const directus = createDirectus<DirectusSchema>(process.env.NEXT_PUBLIC_DIRECTUS_URL ?? '')
		.with(authentication('json', { storage: directusAuthStorageHandler() }))
		.with(rest({ credentials: 'include' }));

	const extraActions = {
		async getSession() {
			try {
				const me = await directus.request(readMe({ fields: ['*', '*.*', '*.*.*'] }));
				return me;
			} catch {
				redirect(ROUTES.LoginPage());
			}
		},
	};

	return { ...directus, ...extraActions };
};

/**
 * Custom Auth Storage for Directus SDK to work correctly with Next.js cookies.
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
			const opts = {
				path: '/',
				httpOnly: false,
				sameSite: 'none', // TODO: investigate why 'Lax' seems to cause issues
				// secure: true, // TODO: activate this when pushed online for chrome to work with sameSite=None
			} as const;

			if (data?.access_token) {
				cookiesStore.set('access_token', data.access_token, opts);
			} else if (data?.access_token === null) {
				cookiesStore.delete('access_token');
			}

			if (data?.refresh_token) {
				cookiesStore.set('refresh_token', data.refresh_token, opts);
			} else if (data?.refresh_token === null) {
				cookiesStore.delete('refresh_token');
			}

			if (data?.expires_at) {
				cookiesStore.set('expires_at', String(data.expires_at), opts);
			} else if (data?.refresh_token === null) {
				cookiesStore.delete('expires_at');
			}

			if (data?.expires) {
				cookiesStore.set('expires', String(data.expires), opts);
			} else if (data?.refresh_token === null) {
				cookiesStore.delete('expires');
			}
		},
	};
};
