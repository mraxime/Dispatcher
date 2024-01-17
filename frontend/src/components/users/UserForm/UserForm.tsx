import type { FC } from 'react';
import { Box, Button, Grid, Stack } from '@mui/material';
import { FormProvider, useForm, type DefaultValues } from 'react-hook-form';

import { createUserSchema, updateUserSchema } from 'src/lib/schemas/user.schema';
import type { Permission, Role } from 'src/lib/types/directus';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import type { UserSubmitData } from './types';
import UserFormContact from './UserFormContact';
import UserFormLicense from './UserFormLicense';
import UserFormUser from './UserFormUser';

type Props = {
	mode: 'create' | 'update';
	defaultValues?: DefaultValues<UserSubmitData>;
	roles?: Role[];
	permissions?: Permission[];
	onSubmit?: (formValues: UserSubmitData) => Promise<void>;
	onCancel?: () => void;
};

const UserForm: FC<Props> = ({
	mode,
	defaultValues,
	roles = [],
	permissions = [],
	onSubmit,
	onCancel,
}) => {
	const isNew = mode === 'create';

	/**
	 * Creates the initial values structure object of the form.
	 */
	const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
		company: payload?.company ?? null,
		first_name: payload?.first_name ?? '',
		last_name: payload?.last_name ?? '',
		role: payload?.role ?? roles[0]?.id ?? '',
		permissions: payload?.permissions ?? [],
		email: payload?.email ?? '',
		phone: payload?.phone ?? '',
		ext: payload?.ext ?? '',
		birthday: payload?.birthday ? new Date(payload.birthday) : null,
		hireday: payload?.hireday ? new Date(payload.hireday) : null,
		password: '',
		passwordConfirm: '',
		blocked: payload?.blocked ?? false,
		emergency_contact: {
			id: payload?.emergency_contact?.id ?? undefined,
			first_name: payload?.emergency_contact?.first_name ?? '',
			last_name: payload?.emergency_contact?.last_name ?? '',
			relation: payload?.emergency_contact?.relation ?? '',
			phone: payload?.emergency_contact?.phone ?? '',
			ext: payload?.emergency_contact?.ext ?? '',
			note: payload?.emergency_contact?.note ?? '',
		},
		driver_license: {
			id: payload?.driver_license?.id ?? undefined,
			number: payload?.driver_license?.number ?? '',
			class: payload?.driver_license?.class ?? '',
			expiration_date: payload?.driver_license?.expiration_date
				? new Date(payload?.driver_license?.expiration_date)
				: undefined,
			note: payload?.driver_license?.note ?? '',
			// capacity: user.driver_license.capacity ?? [],
		},
	});

	const form = useForm<UserSubmitData>({
		resolver: zodResolverEnhanced(isNew ? createUserSchema : updateUserSchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(getInitialValues(formValues));
	});

	return (
		<FormProvider {...form}>
			<form id="user-form" onSubmit={handleFormSubmit} noValidate>
				<Grid container spacing={4}>
					<Grid item xs={12} lg={6}>
						<UserFormUser isNew={isNew} roles={roles} permissions={permissions} />
					</Grid>
					<Grid item xs={12} lg={6}>
						<UserFormContact />
						<Box mt={4}>
							<UserFormLicense />
						</Box>
					</Grid>
				</Grid>

				<Stack mt={4} direction="row" spacing={2} justifyContent="end">
					{onCancel && (
						<Button color="inherit" onClick={onCancel}>
							Annuler
						</Button>
					)}
					<Button
						type="submit"
						variant="contained"
						disabled={form.formState.isSubmitting || !form.formState.isDirty}
					>
						Enregistrer
					</Button>
				</Stack>
			</form>
		</FormProvider>
	);
};

export default UserForm;
