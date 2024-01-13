import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreateTrailerSchema, UpdateTrailerSchema } from 'src/lib/schemas/trailer.schema';
import type { DirectusSchema, Trailer } from 'src/lib/types/directus';
import { withCompanyIsolation } from './utils';

type Params = Query<DirectusSchema, Trailer>;

/**
 * Hook to provide trailers data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useTrailers = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const trailersCache = useSWR(['trailers', params, Cookies.get('company')], ([, params]) =>
		api.request(readItems('trailers', withCompanyIsolation(params))),
	);

	const trailerActions = useMemo(
		() => ({
			setParams,
			revalidate: () => trailersCache.mutate(),

			create: async (payload: CreateTrailerSchema) => {
				const result = await api.request(createItem('trailers', payload));
				await trailersCache.mutate();

				toast.success('Remorque créée !');
				return result;
			},

			update: async (id: number, payload: UpdateTrailerSchema) => {
				const result = await api.request(updateItem('trailers', id, payload));
				await trailersCache.mutate();

				toast.success('Remorque mise à jour !');
				return result;
			},

			delete: async (id: number) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer cette remorque ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('trailers', id));
				await trailersCache.mutate();

				toast.success('Remorque supprimée !');
				return result;
			},
		}),
		[],
	);

	return {
		data: trailersCache.data ?? [],
		params,
		isLoading: trailersCache.isLoading,
		...trailerActions,
	};
};

/**
 * Same as `useTrailers` but for single data.
 */
export const useTrailer = (id: number, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const trailers = useTrailers(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateTrailerSchema) => trailers.update(id, payload),
			delete: async () => trailers.delete(id),
		}),
		[id],
	);

	return {
		data: trailers.data[0],
		isLoading: trailers.isLoading,
		...actions,
	};
};
