import { useMemo, useState } from 'react';
import { createItem, deleteItem, readItems, updateItem, type Query } from '@directus/sdk';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import { api } from 'src/lib/api';
import type {
	CreateCalendarEventSchema,
	UpdateCalendarEventSchema,
} from 'src/lib/schemas/calendar-event.schema';
import type { CalendarEvent, DirectusSchema } from 'src/lib/types/directus';

type Params = Query<DirectusSchema, CalendarEvent>;

/**
 * Hook to provide calendar-events data and actions.
 * It allows components using this hook to access the same cache, avoiding unnecessary fetches.
 */
export const useCalendarEvents = (initialParams?: Params) => {
	const [params, setParams] = useState(initialParams);

	const calendarEventsCache = useSWR(
		['calendar_events', params],
		([, params]) => api.request(readItems('calendar_events', params)),
		{ refreshInterval: 5000 /* 5 secs */ },
	);

	const calendarEventsActions = useMemo(
		() => ({
			setParams,
			revalidate: () => calendarEventsCache.mutate(),

			create: async (payload: CreateCalendarEventSchema) => {
				const result = await api.request(createItem('calendar_events', payload));
				await calendarEventsCache.mutate();

				toast.success('Événement de calendrier créé !');
				return result;
			},

			update: async (id: string, payload: UpdateCalendarEventSchema) => {
				const result = await api.request(updateItem('calendar_events', id, payload));
				await calendarEventsCache.mutate();

				toast.success('Calendrier mis à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(
						`Êtes-vous sûr de vouloir supprimer cet événement de calendrier ?\nLes données seront supprimées de manière permanente.`,
					)
				) {
					return;
				}

				const result = await api.request(deleteItem('calendar_events', id));
				await calendarEventsCache.mutate();

				toast.success('Événement de calendrier supprimé !');
				return result;
			},
		}),
		[],
	);

	return {
		data: calendarEventsCache.data ?? [],
		params,
		isLoading: calendarEventsCache.isLoading,
		isValidating: calendarEventsCache.isValidating,
		...calendarEventsActions,
	};
};

/**
 * Same as `useCalls` but for single data.
 */
export const useCalendarEvent = (id: string, params?: Params) => {
	const newParams = { ...params, filter: { ...params?.filter, id: { _eq: id } }, limit: 1 };
	const calendarEvents = useCalendarEvents(newParams);

	const actions = useMemo(
		() => ({
			update: async (payload: UpdateCalendarEventSchema) => calendarEvents.update(id, payload),
			delete: async () => calendarEvents.delete(id),
			setId: (id: string) => {
				calendarEvents.setParams((current) => ({
					...current,
					filter: { ...current?.filter, id: { _eq: id } },
					limit: 1,
				}));
			},
		}),
		[id],
	);

	return {
		data: calendarEvents.data[0],
		revalidate: calendarEvents.revalidate,
		isLoading: calendarEvents.isLoading,
		isValidating: calendarEvents.isValidating,
		...actions,
	};
};
