'use client';

import { useCallback, useEffect, useState, type FC } from 'react';
import { useRouter } from 'next/navigation';
import type { EventImpl } from '@fullcalendar/core/internal';
import { Dialog } from '@mui/material';
import Calendar from 'src/components/calendar/Calendar';
import CalendarEventForm from 'src/components/calendar/CalendarEventForm';
import { useCalendarEventActions } from 'src/hooks/useCalendarEvents';
import useDisclosure from 'src/hooks/useDisclosure';
import { useSocket } from 'src/providers/SocketProvider';
import type {
	CalendarEvent,
	CalendarEventInput,
	Calendar as CalendarType,
	Towing,
	User,
} from 'src/types';

type Props = {
	calendar: CalendarType;
	calendarEvents: CalendarEvent[];
	users: User[];
	towings: Towing[];
	editable?: boolean;
};

const CalendarView: FC<Props> = ({ calendar, calendarEvents, users, towings, editable = true }) => {
	const eventActions = useCalendarEventActions();
	const formDisclosure = useDisclosure();

	const [range, setRange] = useState<{ start: Date; end: Date }>();
	const [currentEvent, setCurrentEvent] = useState<CalendarEvent>();

	const { socket } = useSocket();
	const router = useRouter();

	useEffect(() => {
		const updateCalendar = () => router.refresh();
		socket.on('update-calendar', updateCalendar);

		return () => {
			socket.off('update-calendar', updateCalendar);
		};
	}, [socket]);

	/* FORM */

	const handleSubmit = useCallback(
		async ({ id: _id, ...values }: CalendarEventInput) => {
			await (currentEvent
				? eventActions.update(currentEvent.id, values)
				: eventActions.create(values));
			handleFormClose();
		},
		[currentEvent],
	);

	const handleDelete = useCallback(async () => {
		if (!currentEvent) return;
		await eventActions.delete(currentEvent.id);
		handleFormClose();
	}, [currentEvent]);

	const handleFormClose = useCallback(() => {
		setRange(undefined);
		setCurrentEvent(undefined);
		formDisclosure.close();
	}, []);

	useEffect(() => {
		if (currentEvent) formDisclosure.open();
	}, [currentEvent]);

	/* EVENT ACTIONS */

	const handleRangeSelect = useCallback((range: { start: Date; end: Date }) => {
		setRange(range);
		formDisclosure.open();
	}, []);

	const handleEventUpdate = useCallback(async (event: EventImpl) => {
		await eventActions.update(event.id, {
			allDay: event.allDay,
			start: event.start ?? undefined,
			end: event.end ?? undefined,
		});
	}, []);

	const handleEventSelect = useCallback(
		async (event: EventImpl) => {
			const calendarEvent = calendarEvents.find(({ id }) => id === event.id);
			setCurrentEvent(calendarEvent);
		},
		[calendarEvents],
	);

	/* Not stable */

	const handleEventDuplicate = useCallback(
		async (event: EventImpl) => {
			const calendarEvent = calendarEvents.find(({ id }) => id === event.id);
			if (!calendarEvent) return;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, ...data } = calendarEvent;
			await eventActions.create(data);
		},
		[calendarEvents],
	);

	return (
		<>
			<Calendar
				events={calendarEvents}
				editable={editable}
				onRangeSelect={handleRangeSelect}
				onEventSelect={handleEventSelect}
				onEventResize={handleEventUpdate}
				onEventDrop={handleEventUpdate}
				onEventDuplicate={handleEventDuplicate}
			/>
			{editable && (
				<Dialog
					fullWidth
					maxWidth="sm"
					onClose={handleFormClose}
					open={formDisclosure.isOpen}
					TransitionProps={{ timeout: formDisclosure.isOpen ? 225 : 0 }} // Disables close transition
				>
					<CalendarEventForm
						id={currentEvent?.id}
						range={range}
						defaultValues={{ calendarId: calendar.id, ...currentEvent }}
						users={users}
						towings={towings}
						onSubmit={handleSubmit}
						onCancel={handleFormClose}
						onDelete={handleDelete}
					/>
				</Dialog>
			)}
		</>
	);
};

export default CalendarView;
