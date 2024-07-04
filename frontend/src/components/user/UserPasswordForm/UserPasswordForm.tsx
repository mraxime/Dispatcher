import type { FC } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Stack,
	TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuthActions } from 'src/hooks/useAuth';
import type { PasswordInput } from 'src/types';
import { zodResolverEnhanced } from 'src/utils/zod';
import { passwordSchema } from 'src/validations/auth';

type Props = {
	onSuccess?: () => void;
};

const UserPasswordForm: FC<Props> = ({ onSuccess }) => {
	const authActions = useAuthActions();

	const form = useForm<PasswordInput>({
		resolver: zodResolverEnhanced(passwordSchema),
		defaultValues: {
			password: '',
			passwordConfirm: '',
		},
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		await authActions.update(formValues);
		form.reset();
		onSuccess?.();
	});

	return (
		<form onSubmit={handleFormSubmit} noValidate>
			<Card>
				<CardHeader title="Changer mon mot de passe" />
				<Divider />
				<CardContent>
					<Stack direction={{ sm: 'row' }} gap={4}>
						<TextField
							error={Boolean(form.formState.errors.password)}
							fullWidth
							helperText={form.formState.errors.password?.message}
							label="Nouveau mot de passe"
							type="password"
							{...form.register('password')}
						/>
						<TextField
							error={Boolean(form.formState.errors.passwordConfirm)}
							fullWidth
							helperText={form.formState.errors.passwordConfirm?.message}
							label="Confirmation du mot de passe"
							type="password"
							{...form.register('passwordConfirm')}
						/>
					</Stack>
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
