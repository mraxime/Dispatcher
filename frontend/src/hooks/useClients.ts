import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreateClientSchema, UpdateClientSchema } from 'src/lib/schemas/clients';
import type { Client, DirectusSchema } from 'src/lib/types/directus';
import { withCompanyIsolation } from './utils';

type Params = Query<DirectusSchema, Client>;

/**
 * Hook to provide clients data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useClients = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const clientsCache = useSWR(['clients', params, Cookies.get('company')], ([, params]) =>
		api.request(readItems('clients', withCompanyIsolation(params))),
	);

	const clientActions = useMemo(
		() => ({
			setParams,
			revalidate: () => clientsCache.mutate(),

			create: async (payload: CreateClientSchema) => {
				const result = await api.request(createItem('clients', payload));
				await clientsCache.mutate();

				toast.success('Client créé !');
				return result;
			},

			update: async (id: number, payload: UpdateClientSchema) => {
				const result = await api.request(updateItem('clients', id, payload));
				await clientsCache.mutate();

				toast.success('Client mis à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer ce client ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('clients', id));
				await clientsCache.mutate();

				toast.success('Client supprimé !');
				return result;
			},
		}),
		[],
	);

	return {
		data: clientsCache.data ?? [],
		params,
		isLoading: clientsCache.isLoading,
		...clientActions,
	};
};

/**
 * Same as `useClients` but for single data.
 */
export const useClient = (id: number, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const clients = useClients(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateClientSchema) => clients.update(id, payload),
			delete: async () => clients.delete(id),
		}),
		[id],
	);

	return {
		data: clients.data[0],
		isLoading: clients.isLoading,
		...actions,
	};
};
