'use client';

import type { FC } from 'react';
import Image from 'next/image';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Checkbox,
	Divider,
	FormControlLabel,
	TextField,
	Typography,
} from '@mui/material';
import { useForm, type DefaultValues } from 'react-hook-form';
import { useAuthActions } from 'src/hooks/useAuth';
import type { LoginInput } from 'src/types';
import { zodResolverEnhanced } from 'src/utils/zod';
import { loginSchema } from 'src/validations/auth';

type Props = {
	defaultValues?: DefaultValues<LoginInput>;
	onSuccess?: () => void;
};

const UserLoginForm: FC<Props> = ({ defaultValues, onSuccess }) => {
	const authActions = useAuthActions();

	const form = useForm<LoginInput>({
		resolver: zodResolverEnhanced(loginSchema),
		defaultValues: {
			username: defaultValues?.username ?? '',
			password: defaultValues?.password ?? '',
			rememberMe: defaultValues?.rememberMe ?? false,
		},
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		await authActions.login(formValues.username, formValues.password);
		form.reset(formValues);
		onSuccess?.();
	});

	return (
		<Card
			component="form"
			noValidate
			autoComplete="off"
			onSubmit={handleFormSubmit}
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column-reverse', sm: 'row' },
			}}
		>
			<CardContent sx={{ maxWidth: { xs: 'auto', sm: '30rem' } }}>
				<Typography color="textPrimary" variant="h4">
					Connexion
				</Typography>
				<Divider sx={{ display: 'block', mt: 1.5, mb: 2 }} />
				<TextField
					autoFocus
					InputProps={{ ...form.register('username') }}
					label="Identifiant"
					type="text"
					error={Boolean(form.formState.errors.username)}
					fullWidth
					helperText={form.formState.errors.username?.message}
					margin="normal"
				/>
				<TextField
					InputProps={{ ...form.register('password') }}
					error={Boolean(form.formState.errors.password)}
					fullWidth
					helperText={form.formState.errors.password?.message}
					label="Mot de passe"
					margin="normal"
					type="password"
				/>
				<FormControlLabel
					control={<Checkbox {...form.register('rememberMe')} />}
					label="Maintenir la connexion"
				/>
				<Box mt={2}>
					<Button
						disabled={form.formState.isSubmitting || !form.formState.isDirty}
						fullWidth
						size="large"
						type="submit"
						variant="contained"
					>
						Continuer
					</Button>
				</Box>
			</CardContent>
			<CardMedia
				title="RQ welcome"
				sx={{
					position: 'relative',
					width: { xs: '100%', sm: '30rem' },
					height: { xs: '20rem', sm: 'auto' },
				}}
			>
				<Image
					priority
					quality={98}
					src="/static/logo.svg"
					alt="rq logo"
					fill
					style={{
						objectFit: 'cover',
					}}
				/>
			</CardMedia>
		</Card>
	);
};

export default UserLoginForm;
