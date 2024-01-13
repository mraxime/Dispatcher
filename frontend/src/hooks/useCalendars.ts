import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type { CreateCalendarSchema, UpdateCalendarSchema } from 'src/lib/schemas/calendar.schema';
import type { Calendar, DirectusSchema } from 'src/lib/types/directus';
import { withCompanyIsolation } from './utils';

type Params = Query<DirectusSchema, Calendar>;

/**
 * Hook to provide calendars data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useCalendars = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const calendarsCache = useSWR(['calendars', params, Cookies.get('company')], ([, params]) =>
		api.request(readItems('calendars', withCompanyIsolation(params))),
	);

	const calendarActions = useMemo(
		() => ({
			setParams,
			revalidate: () => calendarsCache.mutate(),

			create: async (payload: CreateCalendarSchema) => {
				const result = await api.request(createItem('calendars', payload));
				await calendarsCache.mutate();

				toast.success('Calendrier créé !');
				return result;
			},

			update: async (id: string, payload: UpdateCalendarSchema) => {
				const result = await api.request(updateItem('calendars', id, payload));
				await calendarsCache.mutate();

				toast.success('Calendrier mis à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer ce calendrier ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('calendars', id));
				await calendarsCache.mutate();

				toast.success('Calendrier supprimé !');
				return result;
			},
		}),
		[],
	);

	return {
		data: calendarsCache.data ?? [],
		params,
		isLoading: calendarsCache.isLoading,
		...calendarActions,
	};
};

/**
 * Same as `useCalendars` but for single data.
 */
export const useCalendar = (id: string, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const calendars = useCalendars(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateCalendarSchema) => calendars.update(id, payload),
			delete: async (id: string) => calendars.delete(id),
		}),
		[id],
	);

	return {
		data: calendars.data[0],
		isLoading: calendars.isLoading,
		...actions,
	};
};
