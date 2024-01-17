import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	roleParamsSchema,
	type CreateRoleSchema,
	type UpdateRoleSchema,
} from 'src/lib/schemas/role.schema';
import type { RoleParams } from 'src/lib/types/directus';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful role actions.
 */
export const useRoleActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const roleActions = useMemo(
		() => ({
			setParams: (params: RoleParams) => {
				const newValue = roleParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateRoleSchema) => {
				console.log('todo', payload);
				toast.success('Rôle créé !');
			},

			update: async (id: number, payload: UpdateRoleSchema) => {
				console.log('todo', id, payload);
				toast.success('Rôle mis à jour !');
			},

			delete: async (id: number) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer ce rôle ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				console.log('todo', id);
				toast.success('Rôle supprimé !');
			},
		}),
		[],
	);

	return roleActions;
};
