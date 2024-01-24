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
import { Controller, FormProvider, useForm, type DefaultValues } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import { SERVICE_STATUS_MAP } from 'src/lib/constants/services';
import {
	createServiceSchema,
	updateServiceSchema,
	type NewServiceForm,
} from 'src/lib/schemas/service.schema';
import type { Price } from 'src/lib/types/directus';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import ServiceFormPrices from './ServiceFormPrices';
import type { ServiceSubmitData } from './types';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	company: payload?.company ?? undefined,
	name: payload?.name ?? '',
	status: payload?.status ?? 'ACTIVE',
	prices: payload?.prices ?? [],
});

type Props = {
	mode: 'create' | 'update';
	defaultValues?: DefaultValues<ServiceSubmitData>;
	prices: Price[];
	onSubmit?: (data: ServiceSubmitData) => Promise<void>;
	onCancel?: () => void;
};

const ServiceForm: FC<Props> = ({ mode, defaultValues, prices, onSubmit, onCancel }) => {
	const isNew = mode === 'create';

	const form = useForm<NewServiceForm>({
		resolver: zodResolverEnhanced(isNew ? createServiceSchema : updateServiceSchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(getInitialValues(formValues));
	});

	return (
		<FormProvider {...form}>
			<form id="service-form" onSubmit={handleFormSubmit} noValidate>
				<Card>
					<CardHeader
						title={
							<Stack direction="row" alignItems="center" spacing={1}>
								<SvgIcon fontSize="small" color="primary">
									<Icons.service />
								</SvgIcon>
								<Typography variant="h6">Service</Typography>
							</Stack>
						}
					/>
					<Divider />
					<CardContent component={Stack} spacing={4}>
						<TextField
							autoFocus={isNew}
							error={Boolean(form.formState.errors.name)}
							fullWidth
							required
							helperText={form.formState.errors.name?.message}
							label="Nom du service"
							{...form.register('name')}
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
									{Object.values(SERVICE_STATUS_MAP).map(({ title, value }) => (
										<option value={value} key={value}>
											{title}
										</option>
									))}
								</TextField>
							)}
						/>

						<Divider>Prix attaché(s) au service</Divider>

						<ServiceFormPrices prices={prices} />
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
		</FormProvider>
	);
};

export default ServiceForm;
