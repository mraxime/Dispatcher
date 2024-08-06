import type { ChangeEvent, FC, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { IconButton, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import type { Theme } from '@mui/material/styles/createTheme';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { endOfWeek, format, isSameMonth, startOfWeek } from 'date-fns';
import frCA from 'date-fns/locale/fr-CA';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'react-feather';

import type { CalendarView } from '../types';

type ViewOption = {
	label: string;
	value: CalendarView;
};

const viewOptions: ViewOption[] = [
	{
		label: 'Mois',
		value: 'dayGridMonth',
	},
	{
		label: 'Semaine',
		value: 'timeGridWeek',
	},
	{
		label: 'Jour',
		value: 'timeGridDay',
	},
	{
		label: 'Agenda',
		value: 'listWeek',
	},
];

const getTitleByView = (date: Date, view: CalendarView) => {
	if (view === 'timeGridWeek' || view === 'listWeek') {
		const firstWeekDay = startOfWeek(date);
		const lastWeekDay = endOfWeek(date);

		let formattedStart, formattedEnd;
		if (isSameMonth(firstWeekDay, lastWeekDay)) {
			formattedStart = format(firstWeekDay, 'dd', { locale: frCA });
			formattedEnd = format(lastWeekDay, 'dd MMM', { locale: frCA });
		} else {
			formattedStart = format(firstWeekDay, 'dd MMM', { locale: frCA });
			formattedEnd = format(lastWeekDay, 'dd MMM', { locale: frCA });
		}

		return `${formattedStart} - ${formattedEnd} `;
	}

	if (view === 'timeGridDay') {
		return format(date, 'dd MMMM', { locale: frCA });
	}

	// default view
	const dateMonth = format(date, 'MMMM', { locale: frCA });
	return dateMonth.charAt(0).toUpperCase() + dateMonth.slice(1); // capitalize first letter
};

type Props = {
	children?: ReactNode;
	date: Date;
	onAddClick?: () => void;
	onDateNext?: () => void;
	onDatePrev?: () => void;
	onDateToday?: () => void;
	onViewChange?: (view: CalendarView) => void;
	view: CalendarView;
};

const CalendarToolbar: FC<Props> = ({
	date,
	onDateNext,
	onDatePrev,
	onViewChange,
	view,
	...other
}) => {
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

	const handleViewChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>): void => {
			onViewChange?.(event.target.value as CalendarView);
		},
		[onViewChange],
	);

	const dateDay = format(date, 'y', { locale: frCA });

	// On mobile allow only timeGridDay and agenda views
	const availableViewOptions = useMemo(() => {
		return mdUp
			? viewOptions
			: viewOptions.filter((option) => ['timeGridDay', 'listWeek'].includes(option.value));
	}, [mdUp]);

	return (
		<Stack
			alignItems="center"
			flexWrap="wrap"
			justifyContent="space-between"
			flexDirection={{
				xs: 'column',
				md: 'row',
			}}
			spacing={3}
			sx={{ px: 1 }}
			{...other}
		>
			<Stack alignItems="center" direction="row" spacing={1}>
				<Typography variant="h4">{getTitleByView(date, view)}</Typography>
				<Typography sx={{ fontWeight: 400 }} variant="h4">
					{dateDay}
				</Typography>
			</Stack>
			<Stack alignItems="center" direction="row" spacing={2}>
				<IconButton onClick={onDatePrev}>
					<SvgIcon>
						<ChevronLeftIcon />
					</SvgIcon>
				</IconButton>
				<IconButton onClick={onDateNext}>
					<SvgIcon>
						<ChevronRightIcon />
					</SvgIcon>
				</IconButton>
				<TextField
					label="Affichage"
					name="view"
					onChange={handleViewChange}
					select
					SelectProps={{ native: true }}
					size="small"
					sx={{
						minWidth: 120,
						order: {
							xs: -1,
							md: 0,
						},
					}}
					value={view}
				>
					{availableViewOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</TextField>
			</Stack>
		</Stack>
	);
};

export default CalendarToolbar;
