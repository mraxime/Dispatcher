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

import TrailerSearchInput from 'src/components/trailers/TrailerSearchInput';
import UserSearchInput from 'src/components/users/UserSearchInput';
import useIsMounted from 'src/hooks/useIsMounted';
import {
	createCalendarEventSchema,
	updateCalendarEventSchema,
} from 'src/lib/schemas/calendar-event.schema';
import type { Trailer, User } from 'src/lib/types/directus';
import { isObject } from 'src/lib/utils';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import { getUser } from 'src/server/actions/user.action';
import type { CalendarEventSubmitData } from './types';

const getInitialValues = (
	payload?: Props['defaultValues'],
	range?: { start: Date; end: Date },
): Props['defaultValues'] => ({
	calendar: payload?.calendar ?? undefined,
	title: payload?.title ?? '',
	description: payload?.description ?? '',
	allDay: payload?.allDay ?? true,
	color: payload?.color ?? 'info',
	start: payload?.start ?? range?.start ?? new Date(),
	end: payload?.end ?? range?.end ?? addMinutes(new Date(), 30),
	user_assignee: isObject(payload?.user_assignee)
		? payload?.user_assignee.id
		: payload?.user_assignee ?? null,
	trailer_assignee: isObject(payload?.trailer_assignee)
		? payload?.trailer_assignee.id
		: payload?.trailer_assignee ?? null,
});

type Props = {
	mode?: 'create' | 'update';
	defaultValues?: DefaultValues<CalendarEventSubmitData>;
	range?: { start: Date; end: Date };
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

	/**
	 * Try to guess title when selecting a user.
	 * Code is a bit messy but result is great...
	 */
	const isMounted = useIsMounted();
	const userValue = form.watch('user_assignee');
	const titleValue = form.watch('title');
	const shouldGuessTitle =
		(isNew && !form.formState.dirtyFields.title) ||
		(!isNew &&
			!form.formState.dirtyFields.title &&
			(!titleValue || titleValue?.startsWith('Horaire de ')));
	const shouldRemoveTitle = shouldGuessTitle && !userValue;
	useEffect(() => {
		void (async () => {
			if (!isMounted) return;
			// remove title
			if (shouldRemoveTitle) {
				form.setValue('title', '', { shouldDirty: false });
				return;
			}
			// set title
			if (!shouldGuessTitle || !userValue) return;
			const user = await getUser(userValue);
			const title = `Horaire de ${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`;
			form.setValue('title', title, { shouldDirty: false });
		})();
	}, [userValue, shouldGuessTitle, shouldRemoveTitle, isMounted]);

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
