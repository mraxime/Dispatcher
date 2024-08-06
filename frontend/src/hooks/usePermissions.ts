import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreatePermissionSchema, UpdatePermissionSchema } from 'src/lib/schemas/permissions';
import type { CustomPermission, DirectusSchema } from 'src/lib/types/directus';

type Params = Query<DirectusSchema, CustomPermission>;

/**
 * Hook to provide permissions data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const usePermissions = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const permissionsCache = useSWR(['permissions', params], ([, params]) =>
		api.request(readItems('custom_permissions', params)),
	);

	const permissionActions = useMemo(
		() => ({
			setParams,
			revalidate: () => permissionsCache.mutate(),

			create: async (payload: CreatePermissionSchema) => {
				const result = await api.request(createItem('custom_permissions', payload));
				await permissionsCache.mutate();

				toast.success('Permission créée !');
				return result;
			},

			update: async (id: number, payload: UpdatePermissionSchema) => {
				const result = await api.request(updateItem('custom_permissions', id, payload));
				await permissionsCache.mutate();

				toast.success('Permissions mise à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer cette permission ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('custom_permissions', id));
				await permissionsCache.mutate();

				toast.success('Permission supprimée !');
				return result;
			},
		}),
		[],
	);

	return {
		data: permissionsCache.data ?? [],
		params,
		isLoading: permissionsCache.isLoading,
		...permissionActions,
	};
};

/**
 * Same as `usePermissions` but for single data.
 */
export const usePermission = (id: number, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const permissions = usePermissions(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdatePermissionSchema) => permissions.update(id, payload),
			delete: async () => permissions.delete(id),
		}),
		[id],
	);

	return {
		data: permissions.data[0],
		isLoading: permissions.isLoading,
		...actions,
	};
};
