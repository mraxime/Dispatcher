'use client';

import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr-ca';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Dialog } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles/createTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getHours, getMinutes } from 'date-fns';

import { useCalendarEvent, useCalendarEventActions } from 'src/hooks/useCalendarEvents';
import useDisclosure from 'src/hooks/useDisclosure';
import type { Calendar, CalendarEvent, Trailer, User } from 'src/lib/types/directus';
import CalendarContainer from '../CalendarContainer';
import CalendarEventForm, { type CalendarEventSubmitData } from '../CalendarEventForm';
import CalendarToolbar from '../CalendarToolbar';
import type { CalendarView } from '../types';

/**
 * Retreive the palette color from a value.
 */
const getPaletteColor = (theme: Theme, value: string) => {
	if (value === 'success') return theme.palette.success.main;
	if (value === 'warning') return theme.palette.warning.main;
	if (value === 'error') return theme.palette.error.main;
	return theme.palette.info.main;
};

type Props = {
	calendar: Calendar;
	calendarEvents: CalendarEvent[];
	users: User[];
	trailers: Trailer[];
};

const CalendarPage: FC<Props> = ({ calendar, calendarEvents, users, trailers }) => {
	const calendarRef = useRef<FullCalendar | null>(null);

	const [currentEventId, setCurrentEventId] = useState<string | undefined>();
	const currentEvent = useCalendarEvent(currentEventId);
	const calendarEventActions = useCalendarEventActions();

	const theme = useTheme();
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

	const [date, setDate] = useState<Date>(new Date());
	const [view, setView] = useState<CalendarView>(mdUp ? 'timeGridDay' : 'dayGridMonth');
	const [range, setRange] = useState<{ start: number; end: number } | undefined>();
	const formDisclosure = useDisclosure();

	const isNew = !currentEvent.data?.id;

	// format the `calendarEvents` data in a way that react `Fullcalendar` understands.
	const formattedCalendarEvents = useMemo(() => {
		return calendarEvents.map((calendarEvent) => {
			const isAllDayEvent = () => {
				const startHours = getHours(new Date(calendarEvent.start));
				const startMinutes = getMinutes(new Date(calendarEvent.start));
				const endHours = getHours(new Date(calendarEvent.end));
				const endMinutes = getMinutes(new Date(calendarEvent.end));
				// Check if the time is specified in the start and end dates
				// If the time is 0:00 in both dates, consider it as an all day event
				return startHours === 0 && startMinutes === 0 && endHours === 0 && endMinutes === 0
					? true
					: false;
			};

			return {
				...calendarEvent,
				color: getPaletteColor(theme, calendarEvent.color),
				allDay: isAllDayEvent(),
			};
		});
	}, [calendarEvents]);

	useEffect(() => {
		const handleScreenResize = () => {
			const calendarEl = calendarRef.current;
			if (!calendarEl) return;

			const calendarApi = calendarEl.getApi();
			const newView = mdUp ? 'dayGridMonth' : 'timeGridDay';
			calendarApi.changeView(newView);
			setView(newView);
		};

		handleScreenResize();
	}, [mdUp]);

	const calendarMethods = useMemo(
		() => ({
			changeView: (view: CalendarView) => {
				const calendarEl = calendarRef.current;
				if (!calendarEl) return;

				const calendarApi = calendarEl.getApi();
				calendarApi.changeView(view);
				setView(view);
			},

			gotoPrevious: () => {
				const calendarEl = calendarRef.current;
				if (!calendarEl) return;

				const calendarApi = calendarEl.getApi();
				calendarApi.prev();
				setDate(calendarApi.getDate());
			},

			gotoNext: () => {
				const calendarEl = calendarRef.current;
				if (!calendarEl) return;

				const calendarApi = calendarEl.getApi();
				calendarApi.next();
				setDate(calendarApi.getDate());
			},

			setDateToNow: () => {
				const calendarEl = calendarRef.current;
				if (!calendarEl) return;

				const calendarApi = calendarEl.getApi();
				calendarApi.today();
				setDate(calendarApi.getDate());
			},

			selectRange: (arg: DateSelectArg) => {
				const calendarEl = calendarRef.current;
				if (!calendarEl) return;

				const calendarApi = calendarEl.getApi();
				calendarApi.unselect();

				setRange({
					start: arg.start.getTime(),
					end: arg.end.getTime(),
				});

				formDisclosure.open();
			},

			addNewEvent: () => {
				formDisclosure.open();
			},

			selectEvent: (arg: EventClickArg) => {
				setCurrentEventId(arg.event.id);
			},

			dropEvent: async (arg: EventDropArg) => {
				const { event } = arg;

				await calendarEventActions.update(event.id, {
					allDay: event.allDay,
					start: event.start ?? undefined,
					end: event.end ?? undefined,
				});
			},

			resizeEvent: async (arg: EventResizeDoneArg) => {
				const { event } = arg;

				await calendarEventActions.update(event.id, {
					allDay: event.allDay,
					start: event.start ?? undefined,
					end: event.end ?? undefined,
				});
			},
		}),
		[],
	);

	useEffect(() => {
		if (currentEvent.data?.id) {
			formDisclosure.open();
		}
	}, [currentEvent.data?.id]);

	const handleSubmit = async ({ id: _id, ...values }: CalendarEventSubmitData) => {
		if (isNew) {
			await calendarEventActions.create(values);
		} else if (currentEvent.data?.id) {
			await calendarEventActions.update(currentEvent.data.id, values);
		}
		handleFormClose();
	};

	const handleDelete = async () => {
		console.log('tamer');
		if (!currentEvent.data?.id) return;
		console.log('wtf');
		await calendarEventActions.delete(currentEvent.data.id);
		handleFormClose();
	};

	const handleFormClose = () => {
		setRange(undefined);
		setCurrentEventId(undefined);
		formDisclosure.close();
	};

	return (
		<>
			<Stack spacing={3}>
				<CalendarToolbar
					date={date}
					onAddClick={calendarMethods.addNewEvent}
					onDateNext={calendarMethods.gotoNext}
					onDatePrev={calendarMethods.gotoPrevious}
					onDateToday={calendarMethods.setDateToNow}
					onViewChange={calendarMethods.changeView}
					view={view}
				/>
				<Card>
					<CalendarContainer>
						<FullCalendar
							locale={frLocale}
							allDayMaintainDuration
							allDayText="Tt la journée"
							dayMaxEventRows={3}
							droppable
							editable
							eventClick={calendarMethods.selectEvent}
							eventDisplay="block"
							eventDrop={calendarMethods.dropEvent}
							eventResizableFromStart
							eventResize={calendarMethods.resizeEvent}
							events={formattedCalendarEvents}
							headerToolbar={false}
							height={800}
							initialDate={date}
							initialView={view}
							ref={calendarRef}
							rerenderDelay={10}
							select={calendarMethods.selectRange}
							selectable
							weekends
							navLinks
							navLinkDayClick={(date) => {
								const calendarEl = calendarRef.current;
								if (!calendarEl) return;

								const calendarApi = calendarEl.getApi();
								calendarApi.gotoDate(date);
								calendarMethods.changeView('timeGridDay');
							}}
							plugins={[
								dayGridPlugin,
								interactionPlugin,
								listPlugin,
								timeGridPlugin,
								timelinePlugin,
							]}
						/>
					</CalendarContainer>
				</Card>
			</Stack>
			<Dialog
				fullWidth
				maxWidth="sm"
				onClose={handleFormClose}
				open={formDisclosure.isOpen}
				TransitionProps={{ timeout: formDisclosure.isOpen ? 225 : 0 }} // Disables close transition
			>
				<CalendarEventForm
					// TODO: Instead of this key hack, we need to figure out how to revalidate the `currentEvent`
					// when calling `calendarEvents.update`. Otherwise, the form mounts with old cache as `defaultValues`,
					// and when the cache revalidates, the form has already mounted with outdated data.
					key={(currentEvent.data?.start ?? '') + currentEvent.data?.end}
					mode={isNew ? 'create' : 'update'}
					range={range}
					defaultValues={{ calendar: calendar?.id, ...currentEvent.data }}
					users={users}
					trailers={trailers}
					onSubmit={handleSubmit}
					onCancel={handleFormClose}
					onDelete={handleDelete}
				/>
			</Dialog>
		</>
	);
};

export default CalendarPage;
