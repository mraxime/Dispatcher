import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreateCallSchema, UpdateCallSchema } from 'src/lib/schemas/call.schema';
import type { Call, DirectusSchema } from 'src/lib/types/directus';
import { withCompanyIsolation } from './utils';

type Params = Query<DirectusSchema, Call>;

/**
 * Hook to provide calls data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useCalls = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const callsCache = useSWR(['calls', params, Cookies.get('company')], ([, params]) =>
		api.request(readItems('calls', withCompanyIsolation(params))),
	);

	const callActions = useMemo(
		() => ({
			setParams,
			revalidate: () => callsCache.mutate(),

			create: async (payload: CreateCallSchema) => {
				const result = await api.request(createItem('calls', payload));
				await callsCache.mutate();

				toast.success("Formulaire d'appel créé !");
				return result;
			},

			update: async (id: number, payload: UpdateCallSchema) => {
				const result = await api.request(updateItem('calls', id, payload));
				await callsCache.mutate();

				toast.success("Formulaire d'appel mis à jour !");
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer cet appel ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('calls', id));
				await callsCache.mutate();

				toast.success("Formulaire d'appel supprimé !");
				return result;
			},
		}),
		[],
	);

	return {
		data: callsCache.data ?? [],
		params,
		isLoading: callsCache.isLoading,
		...callActions,
	};
};

/**
 * Same as `useCalls` but for single data.
 */
export const useCall = (id: number, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const calls = useCalls(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateCallSchema) => calls.update(id, payload),
			delete: async () => calls.delete(id),
		}),
		[id],
	);

	return {
		data: calls.data[0],
		isLoading: calls.isLoading,
		...actions,
	};
};
