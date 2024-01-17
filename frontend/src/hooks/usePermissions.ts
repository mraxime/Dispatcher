import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	permissionParamsSchema,
	type CreatePermissionSchema,
	type UpdatePermissionSchema,
} from 'src/lib/schemas/permission.schema';
import type { PermissionParams } from 'src/lib/types/directus';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful permission actions.
 */
export const usePermissionActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const permissionActions = useMemo(
		() => ({
			setParams: (params: PermissionParams) => {
				const newValue = permissionParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreatePermissionSchema) => {
				console.log('todo', payload);
				toast.success('Permission créée !');
			},

			update: async (id: number, payload: UpdatePermissionSchema) => {
				console.log('todo', id, payload);
				toast.success('Permission mise à jour !');
			},

			delete: async (id: number) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer cette permission ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				console.log('todo', id);
				toast.success('Permission supprimée !');
			},
		}),
		[],
	);

	return permissionActions;
};
