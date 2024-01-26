'use client';

import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ComponentType,
	type FC,
} from 'react';
import type {
	DateSelectArg,
	EventClickArg,
	EventContentArg,
	EventDropArg,
	EventHoveringArg,
} from '@fullcalendar/core';
import type { EventImpl } from '@fullcalendar/core/internal';
import frLocale from '@fullcalendar/core/locales/fr-ca';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Avatar, Box, ButtonBase, Dialog, SvgIcon, Tooltip, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles/createTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getHours, getMinutes } from 'date-fns';
import toast from 'react-hot-toast';

import { Icons } from 'src/components/base/Icons';
import TrailerCard from 'src/components/trailers/TrailerCard';
import UserCard from 'src/components/users/UserCard';
import useDisclosure from 'src/hooks/useDisclosure';
import type { CalendarEvent, Trailer, User } from 'src/lib/types/directus';
import { isObject } from 'src/lib/utils';
import CalendarContainer from './CalendarContainer';
import CalendarToolbar from './CalendarToolbar';
import type { CalendarView } from './types';

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
	events: CalendarEvent[];
	editable?: boolean;
	onRangeSelect?: (range: { start: Date; end: Date }) => void;
	onEventSelect?: (event: EventImpl) => void;
	onEventResize?: (event: EventImpl) => void;
	onEventDrop?: (event: EventImpl) => void;
	onEventDuplicate?: (event: EventImpl) => void;
};

const Calendar: FC<Props> = ({
	events,
	editable = true,
	onRangeSelect,
	onEventSelect,
	onEventResize,
	onEventDrop,
	onEventDuplicate,
}) => {
	const calendarRef = useRef<FullCalendar | null>(null);

	const theme = useTheme();
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

	// maybe we don't need these
	const [date, setDate] = useState<Date>(new Date());
	const [view, setView] = useState<CalendarView>(mdUp ? 'dayGridMonth' : 'timeGridDay');

	/**
	 * Hack to trigger a rerender when the title is avaible
	 */
	const [, setTitleFix] = useState<string>();
	useEffect(() => {
		setTitleFix(calendarMethods.getTitle());
	}, []);

	/**
	 * Adapt view on viewport change.
	 */
	useEffect(() => {
		const handleScreenResize = () => {
			const calendarEl = calendarRef.current;
			if (!calendarEl) return;

			const calendarApi = calendarEl.getApi();
			const newView: CalendarView = mdUp ? 'dayGridMonth' : 'timeGridDay';
			calendarApi.changeView(newView);
			setView(newView);
		};

		handleScreenResize();
	}, [mdUp]);

	/**
	 * format the `calendarEvents` data in a way that react `Fullcalendar` understands.
	 */
	const formattedCalendarEvents = useMemo(() => {
		return events.map((calendarEvent) => {
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
	}, [events]);

	const calendarMethods = useMemo(
		() => ({
			getTitle: () => {
				const calendarEl = calendarRef.current;
				if (!calendarEl) return;

				const calendarApi = calendarEl.getApi();
				return calendarApi.view.title;
			},

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

				if (onRangeSelect) onRangeSelect({ start: arg.start, end: arg.end });
			},

			selectEvent: (arg: EventClickArg) => {
				if (onEventSelect) onEventSelect(arg.event);
			},

			resizeEvent: async (arg: EventResizeDoneArg) => {
				if (onEventResize) onEventResize(arg.event);
			},

			dropEvent: async (arg: EventDropArg) => {
				if (onEventDrop) onEventDrop(arg.event);
			},

			dayClick: (date: Date) => {
				const calendarEl = calendarRef.current;
				if (!calendarEl) return;

				const calendarApi = calendarEl.getApi();
				calendarApi.gotoDate(date);
				setDate(date);
				calendarMethods.changeView('listDay');
			},
		}),
		[calendarRef.current, onRangeSelect, onEventSelect, onEventResize, onEventDrop],
	);

	/* TODO CLEANUP THESE */

	const [hoveredEvent, setHoveredEvent] = useState<EventImpl>();
	const [copiedEvent, setCopiedEvent] = useState<EventImpl>();

	const handleEventMouseEnter = useCallback((arg: EventHoveringArg) => {
		console.log('hovering:', arg.event.title);
		setHoveredEvent(arg.event);
	}, []);

	const handleEventMouseLeave = useCallback(() => {
		setHoveredEvent(undefined);
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Copy the event
			if (e.ctrlKey && e.key === 'c' && hoveredEvent) {
				e.preventDefault();
				setCopiedEvent(hoveredEvent);
				toast.success(`${hoveredEvent.title} copié !`);
			}
			// Duplicate the event
			else if (e.ctrlKey && e.key === 'v' && copiedEvent) {
				e.preventDefault();
				if (onEventDuplicate) onEventDuplicate(copiedEvent);
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [hoveredEvent]);

	return (
		<Stack spacing={3}>
			<CalendarToolbar
				title={calendarMethods.getTitle() ?? ''}
				view={view}
				onDateNext={calendarMethods.gotoNext}
				onDatePrev={calendarMethods.gotoPrevious}
				onDateToday={calendarMethods.setDateToNow}
				onViewChange={calendarMethods.changeView}
			/>
			<Card>
				<CalendarContainer>
					<FullCalendar
						key={view}
						allDayMaintainDuration
						allDayText="Tte la journée"
						dayMaxEventRows={3}
						droppable
						editable={editable}
						eventClick={calendarMethods.selectEvent}
						eventContent={
							// TODO: check if passing a function doesn't affect performance
							view.startsWith('list') ? (arg) => <ListEventContent {...arg} /> : undefined
						}
						eventDisplay="block"
						eventDrop={calendarMethods.dropEvent}
						eventResizableFromStart
						eventResize={calendarMethods.resizeEvent}
						events={formattedCalendarEvents}
						eventMouseEnter={handleEventMouseEnter}
						eventMouseLeave={handleEventMouseLeave}
						headerToolbar={false}
						height={800}
						initialDate={date}
						initialView={view}
						locale={frLocale}
						navLinkDayClick={calendarMethods.dayClick}
						navLinks
						plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin, timelinePlugin]}
						ref={calendarRef}
						rerenderDelay={10}
						select={calendarMethods.selectRange}
						selectable
						weekends
					/>
				</CalendarContainer>
			</Card>
		</Stack>
	);
};

/**
 * Custom row content for "list" views
 */
const ListEventContent = (eventInfo: EventContentArg) => {
	const user = eventInfo.event.extendedProps.user_assignee as User | string | undefined;
	const trailer = eventInfo.event.extendedProps.trailer_assignee as Trailer | number | undefined;
	const userDisclosure = useDisclosure();
	const trailerDisclosure = useDisclosure();

	const isOpen = userDisclosure.isOpen || trailerDisclosure.isOpen;

	const handleClose = useCallback(() => {
		userDisclosure.close();
		trailerDisclosure.close();
	}, []);

	return (
		<>
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<Stack direction="row">
					<Typography variant="body2">{eventInfo.timeText}</Typography>

					{/* title and subtitle */}
					<Stack ml={eventInfo.timeText ? 1 : undefined}>
						<Typography variant="subtitle1">{eventInfo.event.title}</Typography>
						{/* subtitle details */}
						{isObject(trailer) && (
							<Typography variant="caption">Remorque: {trailer.name}</Typography>
						)}
					</Stack>
				</Stack>

				<Stack direction="row" spacing={1.5}>
					{user && (
						<RowAction
							title="Détails chauffeur"
							Icon={Icons.user}
							onClick={userDisclosure.toggle}
						/>
					)}
					{trailer && (
						<RowAction
							title="Détails remorque"
							Icon={Icons.trailer}
							onClick={trailerDisclosure.toggle}
						/>
					)}
				</Stack>
			</Stack>

			{/* User or Trailer Details Dialog */}
			<Dialog
				fullWidth
				open={isOpen}
				maxWidth="sm"
				onClose={handleClose}
				TransitionProps={{ timeout: isOpen ? 225 : 0 }} // Disables close transition
			>
				{userDisclosure.isOpen
					? isObject(user) && <UserCard data={user} title="Utilisateur" />
					: isObject(trailer) && <TrailerCard data={trailer} />}
			</Dialog>
		</>
	);
};

type RowActionProps = {
	title: string;
	Icon: ComponentType;
	onClick?: () => void;
};

const RowAction: FC<RowActionProps> = ({ title, Icon, onClick }) => (
	<Tooltip title={title}>
		<Box
			component={ButtonBase}
			onClick={(e) => {
				e.stopPropagation();
				onClick?.();
			}}
			sx={{
				alignItems: 'center',
				display: 'flex',
				borderWidth: 2,
				borderStyle: 'solid',
				borderColor: 'divider',
				height: 35,
				width: 35,
				borderRadius: '50%',
			}}
		>
			<Avatar sx={{ height: 27, width: 27 }}>
				<SvgIcon color="primary" fontSize="inherit">
					<Icon />
				</SvgIcon>
			</Avatar>
		</Box>
	</Tooltip>
);

export default Calendar;
