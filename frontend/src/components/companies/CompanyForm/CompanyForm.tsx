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
import { createCompanySchema, updateCompanySchema } from 'src/lib/schemas/companies';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import CompanyFormAdmin from './CompanyFormAdmin';
import type { CompanySubmitData } from './types';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	name: payload?.name ?? '',
	active: payload?.active ?? true,
	address: payload?.address ?? '',
	admin: {
		id: payload?.admin?.id ?? undefined,
		company: payload?.admin?.company ?? null,
		first_name: payload?.admin?.first_name ?? '',
		last_name: payload?.admin?.last_name ?? '',
		email: payload?.admin?.email ?? '',
		phone: payload?.admin?.phone ?? '',
		password: '',
		passwordConfirm: '',
	},
});

type Props = {
	mode: 'create' | 'update';
	defaultValues?: DefaultValues<CompanySubmitData>;
	onSubmit?: (formValues: CompanySubmitData) => Promise<void>;
	onCancel?: () => void;
};

const CompanyForm: FC<Props> = ({ mode, defaultValues, onSubmit, onCancel }) => {
	const isNew = mode === 'create';

	const form = useForm<CompanySubmitData>({
		resolver: zodResolverEnhanced(isNew ? createCompanySchema : updateCompanySchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(getInitialValues(formValues));
	});

	return (
		<FormProvider {...form}>
			<form id="company-form" onSubmit={handleFormSubmit} noValidate>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: { sx: '1fr', md: '1fr 1fr' },
						gap: 4,
					}}
				>
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
						<CardContent>
							<Stack spacing={3.5}>
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
									control={
										<Controller
											control={form.control}
											name="active"
											render={({ field }) => (
												<Switch
													checked={field.value}
													onChange={field.onChange}
													onBlur={field.onBlur}
												/>
											)}
										/>
									}
									label="Active"
								/>
							</Stack>
						</CardContent>
					</Card>
					<CompanyFormAdmin isNew={isNew} />
				</Box>

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
