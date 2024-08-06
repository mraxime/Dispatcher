import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreatePriceSchema, UpdatePriceSchema } from 'src/lib/schemas/prices';
import type { DirectusSchema, Price } from 'src/lib/types/directus';
import { withCompanyIsolation } from './utils';

type Params = Query<DirectusSchema, Price>;

/**
 * Hook to provide prices data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const usePrices = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const pricesCache = useSWR(['prices', params, Cookies.get('company')], ([, params]) =>
		api.request(readItems('prices', withCompanyIsolation(params))),
	);

	const priceActions = useMemo(
		() => ({
			setParams,
			revalidate: () => pricesCache.mutate(),

			create: async (payload: CreatePriceSchema) => {
				const result = await api.request(createItem('prices', payload));
				await pricesCache.mutate();

				toast.success('Prix créé !');
				return result;
			},

			update: async (id: number, payload: UpdatePriceSchema) => {
				const result = await api.request(updateItem('prices', id, payload));
				await pricesCache.mutate();

				toast.success('Prix mis à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer ce prix ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('prices', id));
				await pricesCache.mutate();

				toast.success('Prix supprimé !');
				return result;
			},
		}),
		[],
	);

	return {
		data: pricesCache.data ?? [],
		params,
		isLoading: pricesCache.isLoading,
		...priceActions,
	};
};

/**
 * Same as `usePrices` but for single data.
 */
export const usePrice = (id: number, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const prices = usePrices(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdatePriceSchema) => prices.update(id, payload),
			delete: async () => prices.delete(id),
		}),
		[id],
	);

	return {
		data: prices.data[0],
		isLoading: prices.isLoading,
		...actions,
	};
};
