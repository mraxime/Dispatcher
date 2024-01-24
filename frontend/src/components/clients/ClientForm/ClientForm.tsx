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
import { CLIENT_STATUS_MAP } from 'src/lib/constants/clients';
import { createClientSchema, updateClientSchema } from 'src/lib/schemas/client.schema';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import type { ClientSubmitData } from './types';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	company: payload?.company ?? undefined,
	status: payload?.status ?? 'ACTIVE',
	name: payload?.name ?? '',
	email: payload?.email ?? '',
	phone: payload?.phone ?? '',
	companyName: payload?.companyName ?? '',
});

type Props = {
	mode: 'create' | 'update';
	defaultValues?: DefaultValues<ClientSubmitData>;
	onSubmit?: (data: ClientSubmitData) => Promise<void>;
	onCancel?: () => void;
};

const ClientForm: FC<Props> = ({ mode, defaultValues, onSubmit, onCancel }) => {
	const isNew = mode === 'create';

	const form = useForm<ClientSubmitData>({
		resolver: zodResolverEnhanced(isNew ? createClientSchema : updateClientSchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(getInitialValues(formValues));
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
							error={Boolean(form.formState.errors.name)}
							fullWidth
							required
							helperText={form.formState.errors.name?.message}
							label="Nom complet"
							{...form.register('name')}
						/>
						<TextField
							error={Boolean(form.formState.errors.companyName)}
							fullWidth
							required={false}
							helperText={form.formState.errors.companyName?.message}
							label="Entreprise"
							{...form.register('companyName')}
						/>
					</Stack>

					<TextField
						error={Boolean(form.formState.errors.email)}
						fullWidth
						required
						helperText={form.formState.errors.email?.message}
						label="Courriel"
						{...form.register('email')}
					/>

					<TextField
						error={Boolean(form.formState.errors.phone)}
						fullWidth
						required
						helperText={form.formState.errors.phone?.message}
						label="Téléphone"
						{...form.register('phone')}
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
