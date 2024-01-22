import { useMemo } from 'react';
import toast from 'react-hot-toast';

import type { UpdateUserSchema } from 'src/lib/schemas/user.schema';
import { updateSession, userLogin, userLogout } from 'src/server/actions/auth.action';

export const useSessionActions = () => {
	const sessionActions = useMemo(
		() => ({
			login: async (email: string, password: string) => {
				await userLogin({ email, password, rememberMe: true });
				toast.success('Connexion réussie !');
			},

			logout: async () => {
				await userLogout();
				toast.success('Vous êtes maintenant déconnecté(e)');
			},

			update: async (payload: UpdateUserSchema) => {
				const result = await updateSession(payload);
				toast.success('Profil mis à jour !');
				return result;
			},
		}),
		[],
	);

	return sessionActions;
};
