import { useEffect, type FC } from 'react';
import { Radio, RadioGroup, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { addMinutes } from 'date-fns';
import { Trash as TrashIcon } from 'react-feather';
import { Controller, useForm, type DefaultValues } from 'react-hook-form';
import TowingSearchInput from 'src/components/towing/TowingSearchInput';
import UserSearchInput from 'src/components/user/UserSearchInput';
import type { CalendarEvent, CalendarEventInput, Towing, User } from 'src/types';
import { zodResolverEnhanced } from 'src/utils/zod';
import {
	createCalendarEventSchema,
	updateCalendarEventSchema,
} from 'src/validations/calendar-event';

const getInitialValues = (
	payload?: Props['defaultValues'],
	range?: { start: Date; end: Date },
): Props['defaultValues'] => ({
	calendarId: payload?.calendarId ?? undefined,
	title: payload?.title ?? '',
	description: payload?.description ?? '',
	allDay: payload?.allDay ?? true,
	color: payload?.color ?? 'info',
	start: payload?.start ?? range?.start ?? new Date(),
	end: payload?.end ?? range?.end ?? addMinutes(new Date(), 30),
	userAssigneeId: payload?.userAssigneeId,
	towingAssigneeId: payload?.towingAssigneeId,
});

type Props = {
	/** When provided, the form becomes an 'update'. */
	id?: CalendarEvent['id'];
	defaultValues?: DefaultValues<CalendarEventInput>;
	range?: { start: Date; end: Date };
	users?: User[];
	towings?: Towing[];
	onSubmit?: (data: CalendarEventInput) => Promise<void>;
	onCancel?: () => void;
	onDelete?: (id: string) => void;
};

const CalendarEventForm: FC<Props> = ({
	id,
	defaultValues,
	range,
	users = [],
	towings = [],
	onSubmit,
	onCancel,
	onDelete,
}) => {
	const isNew = !id;

	const form = useForm<CalendarEventInput>({
		defaultValues: getInitialValues(defaultValues, range),
		resolver: zodResolverEnhanced(isNew ? createCalendarEventSchema : updateCalendarEventSchema),
	});

	/**
	 * TODO: cleanup this logic.
	 * Try to guess title when selecting a user.
	 */
	const userValue = form.watch('userAssigneeId');
	useEffect(() => {
		const user = users.find((user) => user.id === userValue);
		const title = user ? `${user.firstName} ${user.lastName}` : '';
		form.setValue('title', title, { shouldDirty: false });
	}, [users, userValue]);

	const handleSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(formValues);
	});

	// TODO: Fix this
	// const handleStartDateChange = (date: Date | null): void => {
	// 	form.setValue('start', date, { shouldDirty: true, shouldValidate: true });
	// 	const endValue = form.getValues('end');
	//
	// 	// Prevent end date to be before start date
	// 	if (endValue && date && date < endValue) {
	// 		form.setValue('end', date, { shouldDirty: true, shouldValidate: true });
	// 	}
	// };

	// TODO: Fix this
	// const handleEndDateChange = (date: Date | null): void => {
	// 	form.setValue('end', date, { shouldDirty: true, shouldValidate: true });
	// 	const startValue = form.getValues('start');
	//
	// 	// Prevent start date to be after end date
	// 	if (startValue && date && date < startValue) {
	// 		form.setValue('start', date, { shouldDirty: true, shouldValidate: true });
	// 	}
	// };

	const handleDelete = async () => {
		if (id) onDelete?.(id);
	};

	return (
		<form id="calendar-event-form" onSubmit={handleSubmit} noValidate>
			<Box sx={{ p: 3 }}>
				<Typography align="center" gutterBottom variant="h5">
					{isNew ? 'Ajouter un événement' : "Modifier l'événement"}
				</Typography>
			</Box>
			<Stack spacing={3.5} sx={{ p: 3 }}>
				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<Controller
						name="userAssigneeId"
						control={form.control}
						render={({ field, fieldState }) => (
							<UserSearchInput
								sx={{ width: '100%' }}
								label="Utilisateur assigné"
								items={users}
								current={field.value}
								onSelect={(user) => field.onChange(user?.id ?? null)}
								error={fieldState.error?.message}
							/>
						)}
					/>
					<Controller
						name="towingAssigneeId"
						control={form.control}
						render={({ field, fieldState }) => (
							<TowingSearchInput
								sx={{ width: '100%' }}
								label="Remorque assignée"
								items={towings}
								current={field.value}
								onSelect={(towing) => field.onChange(towing?.id ?? null)}
								error={fieldState.error?.message}
							/>
						)}
					/>
				</Stack>

				<Divider />

				<TextField
					// autoFocus={isNew}
					fullWidth
					label="Titre"
					required
					error={Boolean(form.formState.errors.title)}
					helperText={form.formState.errors.title?.message}
					{...form.register('title')}
				/>

				{/*
				<TextField
					fullWidth
					label="Description"
					multiline
					error={Boolean(form.formState.errors.description)}
					helperText={form.formState.errors.description?.message}
					{...form.register('description')}
				/>
				*/}

				{/*
				<Controller
					name="allDay"
					control={form.control}
					render={({ field }) => (
						<FormControlLabel
							label="Toute la journée"
							control={
								<Switch
									name={field.name}
									checked={field.value}
									disabled={field.disabled}
									ref={field.ref}
									onBlur={field.onBlur}
									onChange={field.onChange}
								/>
							}
						/>
					)}
				/>
        */}

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<Controller
						name="start"
						control={form.control}
						render={({ field }) => <DateTimePicker label="Début" {...field} />}
					/>
					<Controller
						name="end"
						control={form.control}
						render={({ field }) => (
							<div>
								<DateTimePicker label="Fin" {...field} />
								{Boolean(form.formState.errors.end) && (
									<FormHelperText error>{form.formState.errors.end?.message}</FormHelperText>
								)}
							</div>
						)}
					/>
				</Stack>

				<Controller
					name="color"
					control={form.control}
					render={({ field }) => (
						<FormControlLabel
							label="Couleur"
							sx={{ flexDirection: 'row-reverse', justifyContent: 'start', px: 0.25 }}
							control={
								<RadioGroup
									defaultValue="primary"
									{...field}
									sx={{ display: 'flex', flexDirection: 'row' }}
								>
									<Radio
										value="info"
										color="info"
										sx={{ color: (theme) => theme.palette.info.main }}
									/>
									<Radio
										value="success"
										color="success"
										sx={{ color: (theme) => theme.palette.success.main }}
									/>
									<Radio
										value="warning"
										color="warning"
										sx={{ color: (theme) => theme.palette.warning.main }}
									/>
									<Radio
										value="error"
										color="error"
										sx={{ color: (theme) => theme.palette.error.main }}
									/>
								</RadioGroup>
							}
						/>
					)}
				/>
			</Stack>
			<Divider />
			<Stack alignItems="center" direction="row" justifyContent="start" spacing={1} sx={{ p: 2 }}>
				{!isNew && (
					<Tooltip title="Supprimer">
						<IconButton color="inherit" onClick={handleDelete}>
							<SvgIcon fontSize="small">
								<TrashIcon />
							</SvgIcon>
						</IconButton>
					</Tooltip>
				)}
				<Stack alignItems="center" direction="row" spacing={1} style={{ marginLeft: 'auto' }}>
					{Boolean(onCancel) && (
						<Button color="inherit" onClick={onCancel}>
							Annuler
						</Button>
					)}
					<Button
						type="submit"
						variant="contained"
						disabled={form.formState.isSubmitting || !form.formState.isDirty}
					>
						Confirmer
					</Button>
				</Stack>
			</Stack>
		</form>
	);
};

export default CalendarEventForm;
