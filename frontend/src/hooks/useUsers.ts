import { useMemo, useState } from 'react';
import { createUser, deleteUser, readUsers, updateUser, type Query } from '@directus/sdk';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreateUserSchema, UpdateUserSchema } from 'src/lib/schemas/user.schema';
import type { DirectusSchema, User } from 'src/lib/types/directus';
import { withCompanyIsolation } from './utils';

type Params = Query<DirectusSchema, User>;

/**
 * Hook to provide users data and actions.
 * It allows components using this hook to access the same cache data.
 * This ensures synchronization and avoid unnecessary fetches.
 */
export const useUsers = (initialParams?: Params, companyIsolation = true) => {
	const [params, setParams] = useState(initialParams);

	const usersCache = useSWR(
		['users', params, Cookies.get('company')],
		([, params]) =>
			api.request(
				// @ts-expect-error - Looks fine.
				readUsers(companyIsolation ? withCompanyIsolation(params) : params),
			) as unknown as Promise<User[]>,
	);

	const userActions = useMemo(
		() => ({
			setParams,
			revalidate: () => usersCache.mutate(),

			create: async (payload: CreateUserSchema) => {
				if (payload.permissions) {
					payload = {
						...payload,
						// @ts-expect-error - API permissions takes this junction format
						permissions: payload.permissions.map((id) => ({ custom_permissions_id: id })),
					};
				}

				const result = await api.request(createUser(payload));
				await usersCache.mutate();

				toast.success('Utilisateur créé !');
				return result;
			},

			update: async (id: string, payload: UpdateUserSchema) => {
				if (payload.permissions) {
					payload = {
						...payload,
						// @ts-expect-error - API permissions takes this junction format
						permissions: payload.permissions.map((id) => ({ custom_permissions_id: id })),
					};
				}

				const result = await api.request(updateUser(id, payload));
				await usersCache.mutate();

				toast.success('Utilisateur mis à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer cet utilisateur ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteUser(id));
				await usersCache.mutate();

				toast.success('Utilisateur supprimé !');
				return result;
			},
		}),
		[],
	);

	return {
		data: usersCache.data ?? [],
		params,
		isLoading: usersCache.isLoading,
		...userActions,
	};
};

/**
 * Same as `useUsers` but for single data.
 */
export const useUser = (id: string, params?: Params, companyIsolation = true) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const users = useUsers(newParams, companyIsolation);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateUserSchema) => users.update(id, payload),
			delete: async () => users.delete(id),
		}),
		[id],
	);

	return {
		data: users.data[0],
		isLoading: users.isLoading,
		...actions,
	};
};
