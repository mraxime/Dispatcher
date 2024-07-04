'use client';

import type { FC } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	TextField,
} from '@mui/material';
import { useForm, type DefaultValues } from 'react-hook-form';
import { useAuthActions } from 'src/hooks/useAuth';
import type { UserInput } from 'src/types';
import { zodResolverEnhanced } from 'src/utils/zod';
import { updateUserSchema } from 'src/validations/auth';

type Props = {
	defaultValues?: DefaultValues<UserInput>;
	onSuccess?: () => void;
};

const UserProfileForm: FC<Props> = ({ defaultValues, onSuccess }) => {
	const authActions = useAuthActions();

	const form = useForm<UserInput>({
		resolver: zodResolverEnhanced(updateUserSchema),
		defaultValues: {
			firstName: defaultValues?.firstName ?? '',
			lastName: defaultValues?.lastName ?? '',
			phone: defaultValues?.phone ?? '',
			ext: defaultValues?.ext ?? '',
			email: defaultValues?.email ?? '',
		},
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		await authActions.update(formValues);
		form.reset(formValues);
		onSuccess?.();
	});

	return (
		<form id="profile-form" onSubmit={handleFormSubmit} noValidate>
			<Card>
				<CardHeader title="Détails du compte" />
				<Divider />
				<CardContent>
					<Grid container spacing={4}>
						<Grid item md={6} xs={12}>
							<TextField
								required
								error={Boolean(form.formState.errors.firstName)}
								fullWidth
								helperText={form.formState.errors.firstName?.message}
								label="Prénom"
								{...form.register('firstName')}
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								required
								error={Boolean(form.formState.errors.lastName)}
								fullWidth
								helperText={form.formState.errors.lastName?.message}
								label="Nom"
								{...form.register('lastName')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={Boolean(form.formState.errors.email)}
								fullWidth
								helperText={form.formState.errors.email?.message}
								label="Courriel"
								disabled
								type="email"
								{...form.register('email')}
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								error={Boolean(form.formState.errors.phone)}
								fullWidth
								helperText={form.formState.errors.phone?.message}
								label="Téléphone"
								{...form.register('phone')}
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								error={Boolean(form.formState.errors.ext)}
								fullWidth
								helperText={form.formState.errors.ext?.message}
								label="Poste"
								{...form.register('ext')}
							/>
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
				<Box p={2} display="flex" justifyContent="flex-end">
					<Button
						type="submit"
						variant="contained"
						disabled={form.formState.isSubmitting || !form.formState.isDirty}
					>
						Enregistrer
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default UserProfileForm;
