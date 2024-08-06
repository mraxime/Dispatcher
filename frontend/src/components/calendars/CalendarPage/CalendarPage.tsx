'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr-ca';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Calendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Dialog } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles/createTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getHours, getMinutes } from 'date-fns';
import Cookies from 'js-cookie';

import { useCalendarEvent, useCalendarEvents } from 'src/hooks/useCalendarEvents';
import { useCalendars } from 'src/hooks/useCalendars';
import useDisclosure from 'src/hooks/useDisclosure';
import { useTrailers } from 'src/hooks/useTrailers';
import { useUsers } from 'src/hooks/useUsers';
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

const CalendarPage = () => {
	const company = Cookies.get('company');
	const calendars = useCalendars({ filter: { company: { _eq: company } } });
	const calendar = calendars.data[0];

	const calendarRef = useRef<Calendar | null>(null);
	const calendarEvents = useCalendarEvents({ filter: { calendar: { _eq: undefined } } });
	const currentEvent = useCalendarEvent('');

	useEffect(() => {
		if (company) {
			calendars.setParams((current) => ({
				...current,
				filter: {
					...current?.filter,
					company: { _eq: company },
				},
			}));
		}
	}, [company]);

	// Let's cleanup this mess someday :)
	useEffect(() => {
		if (calendar?.id) {
			console.log('calid:', calendar.id);
			calendarEvents.setParams((current) => ({
				...current,
				filter: {
					...current?.filter,
					calendar: { _eq: calendar.id },
				},
			}));
		}
	}, [calendar?.id]);

	const users = useUsers();
	const trailers = useTrailers();

	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
	const [date, setDate] = useState<Date>(new Date());
	const [view, setView] = useState<CalendarView>(mdUp ? 'timeGridDay' : 'dayGridMonth');

	const formDisclosure = useDisclosure();
	const [range, setRange] = useState<{ start: number; end: number } | undefined>();

	const isNew = !currentEvent.data?.id;
	const theme = useTheme();

	// format the `calendarEvents` data in a way that react `Fullcalendar` understands.
	const formattedCalendarEvents = useMemo(() => {
		return calendarEvents.data.map((calendarEvent) => {
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
	}, [calendarEvents.data]);

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

	// TODO: useMemo
	const calendarActions = useMemo(
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
				currentEvent.setId(arg.event.id);
			},

			dropEvent: async (arg: EventDropArg) => {
				const { event } = arg;

				await currentEvent.revalidate();
				await calendarEvents.update(event.id, {
					allDay: event.allDay,
					start: event.start ?? undefined,
					end: event.end ?? undefined,
				});
				await currentEvent.revalidate();
			},

			resizeEvent: async (arg: EventResizeDoneArg) => {
				const { event } = arg;

				await currentEvent.revalidate();
				await calendarEvents.update(event.id, {
					allDay: event.allDay,
					start: event.start ?? undefined,
					end: event.end ?? undefined,
				});
				await currentEvent.revalidate();
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
			await calendarEvents.create(values);
		} else if (currentEvent.data?.id) {
			await calendarEvents.update(currentEvent.data.id, values);
			await currentEvent.revalidate();
		}
		handleFormClose();
	};

	const handleDelete = async () => {
		const eventId = currentEvent.data?.id;
		if (!eventId) return;
		await calendarEvents.delete(eventId);
		handleFormClose();
	};

	const handleFormClose = () => {
		setRange(undefined);
		currentEvent.setId('');
		formDisclosure.close();
	};

	return (
		<>
			<Stack spacing={3}>
				<CalendarToolbar
					date={date}
					onAddClick={calendarActions.addNewEvent}
					onDateNext={calendarActions.gotoNext}
					onDatePrev={calendarActions.gotoPrevious}
					onDateToday={calendarActions.setDateToNow}
					onViewChange={calendarActions.changeView}
					view={view}
				/>
				<Card>
					<CalendarContainer>
						<Calendar
							locale={frLocale}
							allDayMaintainDuration
							allDayText="Tt la journée"
							dayMaxEventRows={3}
							droppable
							editable
							eventClick={calendarActions.selectEvent}
							eventDisplay="block"
							eventDrop={calendarActions.dropEvent}
							eventResizableFromStart
							eventResize={calendarActions.resizeEvent}
							events={formattedCalendarEvents}
							headerToolbar={false}
							height={800}
							initialDate={date}
							initialView={view}
							ref={calendarRef}
							rerenderDelay={10}
							select={calendarActions.selectRange}
							selectable
							weekends
							navLinks
							navLinkDayClick={(date) => {
								const calendarEl = calendarRef.current;
								if (!calendarEl) return;

								const calendarApi = calendarEl.getApi();
								calendarApi.gotoDate(date);
								calendarActions.changeView('timeGridDay');
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
					users={users.data}
					trailers={trailers.data}
					onSubmit={handleSubmit}
					onCancel={handleFormClose}
					onDelete={handleDelete}
				/>
			</Dialog>
		</>
	);
};

export default CalendarPage;
