'use client';

import type { FC } from 'react';
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Stack,
	SvgIcon,
	TextField,
	Typography,
} from '@mui/material';
import { Controller, useForm, type DefaultValues } from 'react-hook-form';
import { Icons } from 'src/components/base/Icons';
import { CLIENT_STATUS_MAP } from 'src/constants/client';
import { useClientActions } from 'src/hooks/useClients';
import type { Client, ClientInput } from 'src/types';
import { zodResolverEnhanced } from 'src/utils/zod';
import { createClientSchema, updateClientSchema } from 'src/validations/client';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	companyId: payload?.companyId ?? undefined,
	status: payload?.status ?? 'active',
	firstName: payload?.firstName ?? '',
	lastName: payload?.lastName ?? '',
	email: payload?.email ?? '',
	phone: payload?.phone ?? '',
	companyName: payload?.companyName ?? '',
});

type Props = {
	id?: Client['id'];
	defaultValues?: DefaultValues<ClientInput>;
	onSuccess?: () => void;
	onCancel?: () => void;
};

const ClientForm: FC<Props> = ({ id, defaultValues, onSuccess, onCancel }) => {
	const isNew = !id;
	const clientActions = useClientActions();

	const form = useForm<ClientInput>({
		resolver: zodResolverEnhanced(isNew ? createClientSchema : updateClientSchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		isNew ? await clientActions.create(formValues) : await clientActions.update(id, formValues);
		form.reset(getInitialValues(formValues));
		onSuccess?.();
	});

	return (
		<form id="client-form" onSubmit={handleFormSubmit} noValidate>
			<Card>
				<CardHeader
					title={
						<Stack direction="row" alignItems="center" spacing={1}>
							<SvgIcon fontSize="small" color="primary">
								<Icons.client />
							</SvgIcon>
							<Typography variant="h6">Client</Typography>
						</Stack>
					}
				/>
				<Divider />
				<CardContent component={Stack} spacing={4}>
					<Stack direction={{ sm: 'row' }} gap={4}>
						<TextField
							autoFocus={isNew}
							error={Boolean(form.formState.errors.firstName)}
							fullWidth
							required
							helperText={form.formState.errors.firstName?.message}
							label="Prénom"
							{...form.register('firstName')}
						/>
						<TextField
							error={Boolean(form.formState.errors.lastName)}
							fullWidth
							helperText={form.formState.errors.lastName?.message}
							label="Nom"
							{...form.register('lastName')}
						/>
					</Stack>

					<TextField
						error={Boolean(form.formState.errors.phone)}
						fullWidth
						required
						helperText={form.formState.errors.phone?.message}
						label="Téléphone"
						{...form.register('phone')}
					/>

					<TextField
						error={Boolean(form.formState.errors.email)}
						fullWidth
						helperText={form.formState.errors.email?.message}
						label="Courriel"
						{...form.register('email')}
					/>

					<TextField
						error={Boolean(form.formState.errors.companyName)}
						fullWidth
						required={false}
						helperText={form.formState.errors.companyName?.message}
						label="Entreprise"
						{...form.register('companyName')}
					/>

					<Controller
						control={form.control}
						name="status"
						render={({ field }) => (
							<TextField
								error={Boolean(form.formState.errors.status)}
								fullWidth
								helperText={form.formState.errors.status?.message}
								label="Statut"
								select
								SelectProps={{ native: true }}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
							>
								{Object.values(CLIENT_STATUS_MAP).map(({ title, value }) => (
									<option value={value} key={value}>
										{title}
									</option>
								))}
							</TextField>
						)}
					/>
				</CardContent>
			</Card>

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
	);
};

export default ClientForm;
