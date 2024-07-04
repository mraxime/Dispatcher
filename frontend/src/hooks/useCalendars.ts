import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createCalendar, deleteCalendar, updateCalendar } from 'src/server/actions/calendar';
import type { CalendarInput, CalendarParams } from 'src/types';
import { calendarParamsSchema } from 'src/validations/calendar';
import { removeDefaultParams } from 'src/validations/utils';
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
				searchParams.reset(removeDefaultParams(params, calendarParamsSchema));
			},

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CalendarInput) => {
				const result = await createCalendar(payload);
				toast.success('Calendrier créé !');
				return result;
			},

			update: async (id: string, payload: Partial<CalendarInput>) => {
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
