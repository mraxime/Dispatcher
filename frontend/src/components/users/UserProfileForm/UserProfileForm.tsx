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
import { useForm } from 'react-hook-form';

import { updateUserProfileSchema } from 'src/lib/schemas/user.schema';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import type { UserProfileSubmitData } from './types';

type Props = {
	defaultValues?: Partial<UserProfileSubmitData>;
	onSubmit?: (formValues: UserProfileSubmitData) => Promise<void>;
};

const UserProfileForm: FC<Props> = ({ defaultValues, onSubmit }) => {
	const form = useForm<UserProfileSubmitData>({
		resolver: zodResolverEnhanced(updateUserProfileSchema),
		defaultValues: {
			first_name: defaultValues?.first_name ?? '',
			last_name: defaultValues?.last_name ?? '',
			phone: defaultValues?.phone ?? '',
			ext: defaultValues?.ext ?? '',
			email: defaultValues?.email ?? '',
		},
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(formValues);
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
								error={Boolean(form.formState.errors.first_name)}
								fullWidth
								helperText={form.formState.errors.first_name?.message}
								label="Prénom"
								{...form.register('first_name')}
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								required
								error={Boolean(form.formState.errors.last_name)}
								fullWidth
								helperText={form.formState.errors.last_name?.message}
								label="Nom"
								{...form.register('last_name')}
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
								required
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
