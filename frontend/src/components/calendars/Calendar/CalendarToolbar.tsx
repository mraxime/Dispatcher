import type { ChangeEvent, FC, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { IconButton, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import type { Theme } from '@mui/material/styles/createTheme';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'react-feather';

import type { CalendarView } from './types';

type ViewOption = {
	label: string;
	value: CalendarView;
};

const viewOptions: ViewOption[] = [
	{
		label: 'Calendrier (Mois)',
		value: 'dayGridMonth',
	},
	{
		label: 'Calendrier (Semaine)',
		value: 'timeGridWeek',
	},
	{
		label: 'Calendrier (Jour)',
		value: 'timeGridDay',
	},
	// {
	// 	label: 'Liste (Mois)',
	// 	value: 'listMonth',
	// },
	{
		label: 'Liste (Semaine)',
		value: 'listWeek',
	},
	{
		label: 'Liste (Jour)',
		value: 'listDay',
	},
];

type Props = {
	title: string;
	view: CalendarView;
	onDateNext?: () => void;
	onDatePrev?: () => void;
	onDateToday?: () => void;
	onViewChange?: (view: CalendarView) => void;
	children?: ReactNode;
};

const CalendarToolbar: FC<Props> = ({
	title = '',
	view,
	onDateNext,
	onDatePrev,
	onViewChange,
	...restProps
}) => {
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

	const handleViewChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>): void => {
			onViewChange?.(event.target.value as CalendarView);
		},
		[onViewChange],
	);

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
			{...restProps}
		>
			<Stack alignItems="center" direction="row" spacing={1}>
				<Typography
					variant="h4"
					textTransform="capitalize"
					// Eye candy: reduce font-weight on year in the title
					dangerouslySetInnerHTML={{
						__html: title.replaceAll(/(\b\d{4}\b)/g, '<span style="font-weight:400">$1</span>'),
					}}
				/>
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
