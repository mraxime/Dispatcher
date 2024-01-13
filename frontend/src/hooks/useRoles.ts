import { useMemo, useState } from 'react';
import { createRole, deleteRole, readRoles, updateRole, type Query } from '@directus/sdk';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import type { CreateRoleSchema, UpdateRoleSchema } from 'src/lib/schemas/role.schema';
import type { DirectusSchema, UserRole } from 'src/lib/types/directus';

type Params = Query<DirectusSchema, UserRole>;

/**
 * Hook to provide roles data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useRoles = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const rolesCache = useSWR(['roles', params], ([, params]) => api.request(readRoles(params)));

	const roleActions = useMemo(
		() => ({
			setParams,
			revalidate: () => rolesCache.mutate(),

			create: async (payload: CreateRoleSchema) => {
				const result = await api.request(createRole(payload));
				await rolesCache.mutate();

				toast.success('Rôle créé !');
				return result;
			},

			update: async (id: string, payload: UpdateRoleSchema) => {
				const result = await api.request(updateRole(id, payload));
				await rolesCache.mutate();

				toast.success('Rôle mis à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer ce rôle ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteRole(id));
				await rolesCache.mutate();

				toast.success('Rôle supprimé !');
				return result;
			},
		}),
		[],
	);

	return {
		data: rolesCache.data ?? [],
		params,
		isLoading: rolesCache.isLoading,
		...roleActions,
	};
};

/**
 * Same as `useRoles` but for single data.
 */
export const useRole = (id: string, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const roles = useRoles(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateRoleSchema) => roles.update(id, payload),
			delete: async () => roles.delete(id),
		}),
		[id],
	);

	return {
		data: roles.data[0],
		isLoading: roles.isLoading,
		...actions,
	};
};

/**
 * get a single role by name.
 */
export const useRoleByName = (name: (typeof SUPER_USER_ROLES)[number], params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, name: { _eq: name } }, limit: 1 };
	const roles = useRoles(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateRoleSchema) => roles.update(name, payload),
			delete: async () => roles.delete(name),
		}),
		[name],
	);

	return {
		data: roles.data[0],
		isLoading: roles.isLoading,
		...actions,
	};
};
