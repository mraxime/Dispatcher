import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	calendarParamsSchema,
	type CreateCalendarSchema,
	type UpdateCalendarSchema,
} from 'src/lib/schemas/calendar.schema';
import type { CalendarParams } from 'src/lib/types/directus';
import { createCalendar, deleteCalendar, updateCalendar } from 'src/server/actions/calendar.action';
import { useCustomSearchParams } from './useCustomSearchParams';

/**
 * Provides useful calendar actions.
 */
export const useCalendarActions = () => {
	const router = useRouter();
	const searchParams = useCustomSearchParams();

	const calendarActions = useMemo(
		() => ({
			setParams: (params: CalendarParams) => {
				const newValue = calendarParamsSchema.createSearchParams(params);
				searchParams.reset(newValue);
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CreateCalendarSchema) => {
				const result = await createCalendar(payload);
				toast.success('Calendrier créé !');
				return result;
			},

			update: async (id: string, payload: UpdateCalendarSchema) => {
				const result = await updateCalendar(id, payload);
				toast.success('Calendrier mis à jour !');
				return result;
			},

			delete: async (id: string) => {
				if (
					!window.confirm(`
            Êtes-vous sûr de vouloir supprimer ce calendrier ?\n
            Les données seront supprimées de manière permanente.
          `)
				) {
					return;
				}

				await deleteCalendar(id);
				toast.success('Calendrier supprimé !');
			},
		}),
		[],
	);

	return calendarActions;
};
