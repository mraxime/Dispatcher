import type { FC } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Stack,
	SvgIcon,
	TextField,
	Typography,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import type { CompanySubmitData } from './types';

type Props = {
	disabled?: boolean;
	isNew: boolean;
};

const CompanyFormAdmin: FC<Props> = ({ disabled = false, isNew }) => {
	const form = useFormContext<CompanySubmitData>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.user />
						</SvgIcon>
						<Typography variant="h6">Administrateur</Typography>
					</Stack>
				}
			/>
			<Divider />
			<CardContent>
				<Stack spacing={3.5}>
					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						<TextField
							label="Prénom"
							fullWidth
							required
							disabled={disabled}
							error={Boolean(form.formState.errors.admin?.first_name)}
							helperText={form.formState.errors.admin?.first_name?.message}
							{...form.register('admin.first_name')}
						/>
						<TextField
							label="Nom"
							fullWidth
							required
							disabled={disabled}
							error={Boolean(form.formState.errors.admin?.last_name)}
							helperText={form.formState.errors.admin?.last_name?.message}
							{...form.register('admin.last_name')}
						/>
					</Box>

					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						<TextField
							label="Courriel"
							type="email"
							fullWidth
							required
							disabled={disabled}
							error={Boolean(form.formState.errors.admin?.email)}
							helperText={form.formState.errors.admin?.email?.message}
							{...form.register('admin.email')}
						/>
						<TextField
							label="Téléphone"
							type="tel"
							fullWidth
							required
							disabled={disabled}
							error={Boolean(form.formState.errors.admin?.phone)}
							helperText={form.formState.errors.admin?.phone?.message}
							{...form.register('admin.phone')}
						/>
					</Box>

					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						<TextField
							label={isNew ? 'Mot de passe' : 'Nouveau mot de passe'}
							fullWidth
							type="password"
							required={isNew}
							error={Boolean(form.formState.errors.admin?.password)}
							helperText={form.formState.errors.admin?.password?.message}
							{...form.register('admin.password')}
						/>
						<TextField
							label="Confirmation"
							fullWidth
							type="password"
							required={isNew}
							error={Boolean(form.formState.errors.admin?.passwordConfirm)}
							helperText={form.formState.errors.admin?.passwordConfirm?.message}
							{...form.register('admin.passwordConfirm')}
						/>
					</Box>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CompanyFormAdmin;
