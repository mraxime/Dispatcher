import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	userParamsSchema,
	type CreateUserSchema,
	type UpdateUserSchema,
} from 'src/lib/schemas/user.schema';
import type { UserParams } from 'src/lib/types/directus';
import { createUser, deleteUser, updateUser } from 'src/server/actions/user.action';
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
				const newValue = userParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateUserSchema) => {
				const result = await createUser(payload);
				toast.success('Utilisateur créé !');
				return result;
			},

			update: async (id: string, payload: UpdateUserSchema) => {
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
