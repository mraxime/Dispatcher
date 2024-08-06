import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreateServiceSchema, UpdateServiceSchema } from 'src/lib/schemas/services';
import type { DirectusSchema, Service } from 'src/lib/types/directus';
import { withCompanyIsolation } from './utils';

type Params = Query<DirectusSchema, Service>;

/**
 * Hook to provide services data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useServices = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const servicesCache = useSWR(['services', params, Cookies.get('company')], ([, params]) =>
		api.request(readItems('services', withCompanyIsolation(params))),
	);

	const serviceActions = useMemo(
		() => ({
			setParams,
			revalidate: () => servicesCache.mutate(),

			create: async (payload: CreateServiceSchema) => {
				// fix wrong prices format for junction
				if (payload.prices) {
					const pricesFormat = payload.prices.map((id) => ({
						price_id: id,
					}));
					// @ts-expect-error - API permissions takes this junction format
					payload = { ...payload, prices: pricesFormat };
				}

				const result = await api.request(createItem('services', payload));
				await servicesCache.mutate();

				toast.success('Service créé !');
				return result;
			},

			update: async (id: number, payload: UpdateServiceSchema) => {
				// fix wrong prices format for junction
				if (payload.prices) {
					const pricesFormat = payload.prices.map((id) => ({
						price_id: id,
					}));
					// @ts-expect-error - API permissions takes this junction format
					payload = { ...payload, prices: pricesFormat };
				}

				const result = await api.request(updateItem('services', id, payload));
				await servicesCache.mutate();

				toast.success('Service mis à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer ce service ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('services', id));
				await servicesCache.mutate();

				toast.success('Service supprimé !');
				return result;
			},
		}),
		[],
	);

	return {
		data: servicesCache.data ?? [],
		params,
		isLoading: servicesCache.isLoading,
		...serviceActions,
	};
};

/**
 * Same as `useServices` but for single data.
 */
export const useService = (id: number, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const services = useServices(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateServiceSchema) => services.update(id, payload),
			delete: async () => services.delete(id),
		}),
		[id],
	);

	return {
		data: services.data[0],
		isLoading: services.isLoading,
		...actions,
	};
};
