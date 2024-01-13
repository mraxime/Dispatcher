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

import { passwordUpdateSchema } from 'src/lib/schemas/user.schema';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import type { UserPasswordSubmitData } from './types';

type Props = {
	onSubmit?: (formValues: UserPasswordSubmitData) => Promise<void>;
};

const UserPasswordForm: FC<Props> = ({ onSubmit }) => {
	const form = useForm<UserPasswordSubmitData>({
		resolver: zodResolverEnhanced(passwordUpdateSchema),
		defaultValues: {
			password: '',
			passwordConfirm: '',
		},
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset();
	});

	return (
		<form onSubmit={handleFormSubmit} noValidate>
			<Card>
				<CardHeader title="Changer mon mot de passe" />
				<Divider />
				<CardContent>
					<Grid container spacing={4}>
						<Grid item md={4} sm={6} xs={12}>
							<TextField
								error={Boolean(form.formState.errors.password)}
								fullWidth
								helperText={form.formState.errors.password?.message}
								label="Nouveau mot de passe"
								type="password"
								{...form.register('password')}
							/>
						</Grid>
						<Grid item md={4} sm={6} xs={12}>
							<TextField
								error={Boolean(form.formState.errors.passwordConfirm)}
								fullWidth
								helperText={form.formState.errors.passwordConfirm?.message}
								label="Confirmation du mot de passe"
								type="password"
								{...form.register('passwordConfirm')}
							/>
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
				<Box p={2} display="flex" justifyContent="flex-end">
					<Button
						type="submit"
						variant="contained"
						disabled={form.formState.isLoading || !form.formState.isDirty}
					>
						Enregistrer
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default UserPasswordForm;
