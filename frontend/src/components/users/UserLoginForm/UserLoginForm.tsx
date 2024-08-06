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
import { useForm } from 'react-hook-form';

import { loginSchema } from 'src/lib/schemas/users';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import type { UserLoginSubmitData } from './types';

type Props = {
	defaultValues?: Partial<UserLoginSubmitData>;
	onSubmit?: (formValues: UserLoginSubmitData) => Promise<void>;
};

const UserLoginForm: FC<Props> = ({ defaultValues, onSubmit }) => {
	const form = useForm<UserLoginSubmitData>({
		resolver: zodResolverEnhanced(loginSchema),
		defaultValues: {
			email: defaultValues?.email ?? '',
			password: defaultValues?.password ?? '',
			rememberMe: defaultValues?.rememberMe ?? false,
		},
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(formValues);
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
					InputProps={{ ...form.register('email') }}
					label="Courriel"
					type="email"
					error={Boolean(form.formState.errors.email)}
					fullWidth
					helperText={form.formState.errors.email?.message}
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
					src="/static/logo.webp"
					alt="Répartition Québec logo"
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
