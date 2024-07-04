import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createUser, deleteUser, updateUser } from 'src/server/actions/user';
import type { UserInput, UserParams } from 'src/types';
import { userParamsSchema } from 'src/validations/auth';
import { removeDefaultParams } from 'src/validations/utils';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful user actions.
 */
export const useUserActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const userActions = useMemo(
		() => ({
			setParams: (params: UserParams) => {
				searchParams.reset(removeDefaultParams(params, userParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: UserInput) => {
				const result = await createUser(payload);
				toast.success('Utilisateur créé !');
				return result;
			},

			update: async (id: string, payload: Partial<UserInput>) => {
				const result = await updateUser(id, payload);
				toast.success('Utilisateur mis à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteUser(id);
				toast.success('Utilisateur supprimé !');
			},
		}),
		[],
	);

	return userActions;
};
