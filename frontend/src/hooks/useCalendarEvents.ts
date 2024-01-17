import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
	calendarEventParamsSchema,
	type CreateCalendarEventSchema,
	type UpdateCalendarEventSchema,
} from 'src/lib/schemas/calendar-event.schema';
import type { CalendarEvent, CalendarEventParams } from 'src/lib/types/directus';
import {
	createCalendarEvent,
	deleteCalendarEvent,
	getCalendarEvent,
	updateCalendarEvent,
} from 'src/server/actions/calendar-event.action';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful calendar-event actions.
 */
export const useCalendarEventActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const calendarEventActions = useMemo(
		() => ({
			setParams: (params: CalendarEventParams) => {
				const newValue = calendarEventParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateCalendarEventSchema) => {
				const result = await createCalendarEvent(payload);
				toast.success('Événement de calendrier créé !');
				return result;
			},

			update: async (id: string, payload: UpdateCalendarEventSchema) => {
				const result = await updateCalendarEvent(id, payload);
				toast.success('Calendrier mis à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer cet événement de calendrier ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteCalendarEvent(id);
				toast.success('Événement de calendrier supprimée !');
			},
		}),
		[],
	);

	return calendarEventActions;
};

export const useCalendarEvent = (
	id: string | undefined,
	opts?: { initialData?: CalendarEvent; params?: CalendarEventParams },
) => {
	const calendarEventCache = useQuery({
		queryKey: ['calendar-event', id, opts?.params],
		queryFn: async () => {
			if (id) return await getCalendarEvent(id, opts?.params);
		},
		initialData: opts?.initialData,
	});

	return {
		data: calendarEventCache.data,
		isLoading: calendarEventCache.isLoading,
	};
};
