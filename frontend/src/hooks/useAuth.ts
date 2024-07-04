import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { login, logout, updateMe } from 'src/server/actions/auth';
import type { UserInput } from 'src/types';

export const useAuthActions = () => {
	const authActions = useMemo(
		() => ({
			login: async (username: string, password: string, rememberMe = true) => {
				const result = await login({ username, password, rememberMe });
				if (result?.error) toast.error(result.error);
				else toast.success('Connexion réussie !');
			},

			logout: async () => {
				await logout();
				toast.success('Vous êtes maintenant déconnecté(e)');
			},

			update: async (payload: Partial<UserInput>) => {
				const result = await updateMe(payload);
				toast.success('Profil mis à jour !');
				return result;
			},
		}),
		[],
	);

	return authActions;
};
