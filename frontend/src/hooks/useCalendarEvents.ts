import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSocket } from 'src/providers/SocketProvider';
import {
	createCalendarEvent,
	deleteCalendarEvent,
	updateCalendarEvent,
} from 'src/server/actions/calendar-event';
import type { CalendarEventInput } from 'src/types';

/**
 * Provides useful calendar-event actions.
 */
export const useCalendarEventActions = () => {
	const router = useRouter();
	const { socket } = useSocket();

	const calendarEventActions = useMemo(
		() => ({
			// setParams: (params: CalendarEventParams) => {
			// 	searchParams.reset(params);
			// },

			revalidate: () => {
				router.refresh();
			},

			create: async (payload: CalendarEventInput) => {
				const result = await createCalendarEvent(payload);
				toast.success('Événement de calendrier créé !');
				// TODO: specify which companyId calendar to update
				socket.emit('update-calendar');
				return result;
			},

			update: async (id: string, payload: Partial<CalendarEventInput>) => {
				const result = await updateCalendarEvent(id, payload);
				toast.success('Calendrier mis à jour !');
				// TODO: specify which companyId calendar to update
				socket.emit('update-calendar');
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
				// TODO: specify which companyId calendar to update
				socket.emit('update-calendar');
			},
		}),
		[],
	);

	return calendarEventActions;
};
