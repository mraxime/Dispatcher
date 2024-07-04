'use client';

import type { FC } from 'react';
import { Box, Button, Grid, Stack } from '@mui/material';
import { FormProvider, useForm, type DefaultValues } from 'react-hook-form';
import { useUserActions } from 'src/hooks/useUsers';
import type { Company, Permission, User } from 'src/types';
import { zodResolverEnhanced } from 'src/utils/zod';
import { createUserSchema, updateUserSchema } from 'src/validations/auth';
import type { UserSubmitData } from './types';
import UserFormContact from './UserFormContact';
import UserFormLicense from './UserFormLicense';
import UserFormUser from './UserFormUser';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	companyId: payload?.companyId ?? undefined,
	firstName: payload?.firstName ?? '',
	lastName: payload?.lastName ?? '',
	role: payload?.role ?? 'employee',
	permissions: payload?.permissions ?? [],
	email: payload?.email ?? '',
	username: payload?.username ?? '',
	phone: payload?.phone ?? '',
	ext: payload?.ext ?? '',
	birthday: payload?.birthday ?? null,
	hiredAt: payload?.hiredAt ?? null,
	password: '',
	passwordConfirm: '',
	status: payload?.status ?? 'active',
	// LATER
	// emergency_contact: {
	// 	id: payload?.emergency_contact?.id ?? undefined,
	// 	first_name: payload?.emergency_contact?.first_name ?? '',
	// 	last_name: payload?.emergency_contact?.last_name ?? '',
	// 	relation: payload?.emergency_contact?.relation ?? '',
	// 	phone: payload?.emergency_contact?.phone ?? '',
	// 	ext: payload?.emergency_contact?.ext ?? '',
	// 	note: payload?.emergency_contact?.note ?? '',
	// },
	// driver_license: {
	// 	id: payload?.driver_license?.id ?? undefined,
	// 	number: payload?.driver_license?.number ?? '',
	// 	class: payload?.driver_license?.class ?? '',
	// 	expiration_date: payload?.driver_license?.expiration_date
	// 		? payload?.driver_license?.expiration_date
	// 		: undefined,
	// 	note: payload?.driver_license?.note ?? '',
	// 	// capacity: user.driver_license.capacity ?? [],
	// },
});

type Props = {
	id?: User['id'];
	defaultValues?: DefaultValues<User>;
	companies?: Company[];
	permissions?: Permission[];
	onSuccess?: () => void;
	onCancel?: () => void;
};

const UserForm: FC<Props> = ({
	id,
	defaultValues,
	companies = [],
	permissions = [],
	onSuccess,
	onCancel,
}) => {
	const isNew = !id;
	const userActions = useUserActions();

	const form = useForm<UserSubmitData>({
		resolver: zodResolverEnhanced(isNew ? createUserSchema : updateUserSchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		isNew ? await userActions.create(formValues) : await userActions.update(id, formValues);
		form.reset(getInitialValues(formValues));
		onSuccess?.();
	});

	return (
		<FormProvider {...form}>
			<form id="user-form" onSubmit={handleFormSubmit} noValidate>
				<Grid container spacing={4}>
					<Grid item xs={12} lg={6}>
						<UserFormUser isNew={isNew} companies={companies} permissions={permissions} />
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
