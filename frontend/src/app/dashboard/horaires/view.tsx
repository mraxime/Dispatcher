'use client';

import { useCallback, useEffect, useState, type FC } from 'react';
import type { EventImpl } from '@fullcalendar/core/internal';
import { Dialog } from '@mui/material';

import Calendar from 'src/components/calendars/Calendar';
import CalendarEventForm, {
	type CalendarEventSubmitData,
} from 'src/components/calendars/CalendarEventForm';
import { useCalendarEventActions } from 'src/hooks/useCalendarEvents';
import useDisclosure from 'src/hooks/useDisclosure';
import type {
	CalendarEvent,
	Calendar as CalendarType,
	Trailer,
	User,
} from 'src/lib/types/directus';

type Props = {
	calendar: CalendarType;
	users: User[];
	trailers: Trailer[];
	editable: boolean;
};

const CalendarView: FC<Props> = ({ calendar, users, trailers, editable }) => {
	const eventActions = useCalendarEventActions();
	const formDisclosure = useDisclosure();

	const [range, setRange] = useState<{ start: Date; end: Date }>();
	const [currentEvent, setCurrentEvent] = useState<CalendarEvent>();

	/* FORM */

	const handleSubmit = useCallback(
		async ({ id: _id, ...values }: CalendarEventSubmitData) => {
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
			const calendarEvent = calendar.events.find(({ id }) => id === event.id);
			setCurrentEvent(calendarEvent);
		},
		[calendar.events],
	);

	/* Not stable */

	const handleEventDuplicate = useCallback(
		async (event: EventImpl) => {
			const calendarEvent = calendar.events.find(({ id }) => id === event.id);
			if (!calendarEvent) return;
			const { id: _id, ...data } = calendarEvent;
			await eventActions.create(data);
		},
		[calendar.events],
	);

	return (
		<>
			<Calendar
				events={calendar.events}
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
						mode={currentEvent ? 'update' : 'create'}
						range={range}
						defaultValues={{ calendar: calendar.id, ...currentEvent }}
						users={users}
						trailers={trailers}
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
