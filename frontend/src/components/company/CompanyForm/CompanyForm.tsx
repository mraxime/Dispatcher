'use client';

import type { FC } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	FormControlLabel,
	Stack,
	SvgIcon,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { Controller, FormProvider, useForm, type DefaultValues } from 'react-hook-form';
import { Icons } from 'src/components/base/Icons';
import { useCompanyActions } from 'src/hooks/useCompanies';
import type { Company, CompanyInput } from 'src/types';
import { zodResolverEnhanced } from 'src/utils/zod';
import { createCompanySchema, updateCompanySchema } from 'src/validations/company';
import CompanySelectInput from '../CompanySelectInput';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	parentCompanyId: payload?.parentCompanyId ?? undefined,
	name: payload?.name ?? '',
	status: payload?.status ?? 'active',
	address: payload?.address ?? '',
});

type Props = {
	id?: Company['id'];
	companies: Company[];
	defaultValues?: DefaultValues<CompanyInput>;
	onSuccess?: () => void;
	onCancel?: () => void;
};

const CompanyForm: FC<Props> = ({ id, companies, defaultValues, onSuccess, onCancel }) => {
	const isNew = !id;
	const companyActions = useCompanyActions();

	const form = useForm<CompanyInput>({
		resolver: zodResolverEnhanced(isNew ? createCompanySchema : updateCompanySchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		isNew ? await companyActions.create(formValues) : await companyActions.update(id, formValues);
		form.reset(getInitialValues(formValues));
		onSuccess?.();
	});

	return (
		<FormProvider {...form}>
			<form id="company-form" onSubmit={handleFormSubmit} noValidate>
				<Card>
					<CardHeader
						title={
							<Stack direction="row" alignItems="center" spacing={1}>
								<SvgIcon fontSize="small" color="primary">
									<Icons.company />
								</SvgIcon>
								<Typography variant="h6">Entreprise</Typography>
							</Stack>
						}
					/>
					<Divider />
					<CardContent component={Stack} spacing={3.5}>
						<Controller
							name="parentCompanyId"
							control={form.control}
							render={({ field }) => (
								<CompanySelectInput
									{...field}
									label="Appartient à"
									items={companies}
									onSelect={(company) => field.onChange(company.id)}
								/>
							)}
						/>

						<TextField
							autoFocus={isNew}
							error={Boolean(form.formState.errors.name)}
							fullWidth
							required
							helperText={form.formState.errors.name?.message}
							label="Nom de l'entreprise"
							{...form.register('name')}
						/>

						<TextField
							error={Boolean(form.formState.errors.address)}
							fullWidth
							required
							helperText={form.formState.errors.address?.message}
							label="Adresse"
							{...form.register('address')}
						/>

						<FormControlLabel
							label="Active"
							control={
								<Controller
									control={form.control}
									name="status"
									render={({ field }) => (
										<Switch
											checked={field.value === 'active'}
											onChange={(_, value) => {
												field.onChange(value === true ? 'active' : 'inactive');
											}}
											onBlur={field.onBlur}
										/>
									)}
								/>
							}
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
		</FormProvider>
	);
};

export default CompanyForm;
