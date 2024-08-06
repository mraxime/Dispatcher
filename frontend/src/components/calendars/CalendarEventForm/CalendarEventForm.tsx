import type { FC } from 'react';
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

import TrailerSearchInput from 'src/components/trailers/TrailerSearchInput';
import UserSearchInput from 'src/components/users/UserSearchInput';
import {
	createCalendarEventSchema,
	updateCalendarEventSchema,
} from 'src/lib/schemas/calendar-events';
import type { Trailer, User } from 'src/lib/types/directus';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import type { CalendarEventSubmitData } from './types';

const getInitialValues = (
	payload?: Props['defaultValues'],
	range?: { start: number; end: number },
): Props['defaultValues'] => ({
	calendar: payload?.calendar ?? undefined,
	title: payload?.title ?? '',
	description: payload?.description ?? '',
	allDay: payload?.allDay ?? true,
	color: payload?.color ?? 'info',
	start: payload?.start
		? new Date(payload.start)
		: range?.start
			? new Date(range.start)
			: new Date(),
	end: payload?.end
		? new Date(payload.end)
		: range?.end
			? new Date(range.end)
			: addMinutes(new Date(), 30),
	user_assignee: payload?.user_assignee ?? null,
	trailer_assignee: payload?.trailer_assignee ?? null,
});

type Props = {
	mode?: 'create' | 'update';
	defaultValues?: DefaultValues<CalendarEventSubmitData>;
	range?: { start: number; end: number };
	users?: User[];
	trailers?: Trailer[];
	onSubmit?: (data: CalendarEventSubmitData) => Promise<void>;
	onCancel?: () => void;
	onDelete?: (id: string) => void;
};

const CalendarEventForm: FC<Props> = ({
	mode = 'create',
	defaultValues,
	range,
	users = [],
	trailers = [],
	onSubmit,
	onCancel,
	onDelete,
}) => {
	const isNew = mode === 'create';

	const form = useForm<CalendarEventSubmitData>({
		defaultValues: getInitialValues(defaultValues, range),
		resolver: zodResolverEnhanced(isNew ? createCalendarEventSchema : updateCalendarEventSchema),
	});

	const handleSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(formValues);
	});

	const handleStartDateChange = (date: Date | null): void => {
		form.setValue('start', date, { shouldDirty: true, shouldValidate: true });
		const endValue = form.getValues('end');

		// Prevent end date to be before start date
		if (endValue && date && date < endValue) {
			form.setValue('end', date, { shouldDirty: true, shouldValidate: true });
		}
	};

	const handleEndDateChange = (date: Date | null): void => {
		form.setValue('end', date, { shouldDirty: true, shouldValidate: true });
		const startValue = form.getValues('start');

		// Prevent start date to be after end date
		if (startValue && date && date < startValue) {
			form.setValue('start', date, { shouldDirty: true, shouldValidate: true });
		}
	};

	const handleDelete = async () => {
		if (onDelete && defaultValues?.id) onDelete(defaultValues.id);
	};

	return (
		<form id="calendar-event-form" onSubmit={handleSubmit} noValidate>
			<Box sx={{ p: 3 }}>
				<Typography align="center" gutterBottom variant="h5">
					{isNew ? 'Ajouter un événement' : "Modifier l'événement"}
				</Typography>
			</Box>
			<Stack spacing={3.5} sx={{ p: 3 }}>
				<TextField
					autoFocus={isNew}
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
						render={({ field }) => (
							<DateTimePicker label="Début" {...field} onChange={handleStartDateChange} />
						)}
					/>
					<Controller
						name="end"
						control={form.control}
						render={({ field }) => (
							<DateTimePicker label="Fin" {...field} onChange={handleEndDateChange} />
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

				<Divider />

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<Controller
						name="user_assignee"
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
						name="trailer_assignee"
						control={form.control}
						render={({ field, fieldState }) => (
							<TrailerSearchInput
								sx={{ width: '100%' }}
								label="Remorque assignée"
								items={trailers}
								current={field.value}
								onSelect={(trailer) => field.onChange(trailer?.id ?? null)}
								error={fieldState.error?.message}
							/>
						)}
					/>
				</Stack>

				{Boolean(form.formState.errors.end) && (
					<FormHelperText error>{form.formState.errors.end?.message}</FormHelperText>
				)}
			</Stack>
			<Divider />
			<Stack alignItems="center" direction="row" justifyContent="start" spacing={1} sx={{ p: 2 }}>
				{!isNew && (
					<Tooltip title="Supprimer">
						<IconButton onClick={handleDelete}>
							<SvgIcon>
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
