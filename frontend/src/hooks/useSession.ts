import { useMemo } from 'react';
import { readMe, updateMe } from '@directus/sdk';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { UpdateUserSchema } from 'src/lib/schemas/users';
import type { User } from 'src/lib/types/directus';

const handleSession = async () => {
	try {
		return (await api.request(readMe({ fields: ['*', '*.*', '*.*.*'] }))) as unknown as User;
	} catch {
		console.warn('Not authentified');
		await api.logout();
	}
};

/**
 * Hook to provide the current session data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useOptionalSession = () => {
	const sessionCache = useSWR(['session'], handleSession);

	const sessionActions = useMemo(
		() => ({
			revalidate: () => sessionCache.mutate(),

			login: async (email: string, password: string) => {
				const result = await api.login(email, password);
				// select current company by default
				const session = await api.getSession();
				if (session.company?.id) Cookies.set('company', session.company.id);

				await sessionCache.mutate();

				toast.success('Connexion réussie !');
				return result;
			},

			logout: async () => {
				await api.logout();
				await sessionCache.mutate();

				toast.success('Vous êtes maintenant déconnecté(e)');
			},

			update: async (payload: UpdateUserSchema) => {
				const result = await api.request(updateMe(payload));
				await sessionCache.mutate();

				toast.success('Profil mis à jour !');
				return result;
			},
		}),
		[],
	);

	return {
		data: sessionCache.data,
		isLoading: sessionCache.isLoading,
		...sessionActions,
	};
};
