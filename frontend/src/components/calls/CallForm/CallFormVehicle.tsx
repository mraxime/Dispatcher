import type { FC } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	InputAdornment,
	Stack,
	SvgIcon,
	TextField,
	Typography,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import type { CallSubmitData } from './types';

type Props = {
	disabled?: boolean;
};

const CallFormVehicle: FC<Props> = ({ disabled = false }) => {
	const form = useFormContext<CallSubmitData>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.vehicle />
						</SvgIcon>
						<Typography variant="h6">Véhicule à remorquer</Typography>
					</Stack>
				}
			/>
			<Divider />

			<CardContent>
				<Stack spacing={3.5}>
					<TextField
						error={
							Boolean(form.formState.errors.vehicle?.model) ||
							Boolean(form.formState.errors.vehicle?.root)
						}
						fullWidth
						required
						disabled={disabled}
						helperText={
							form.formState.errors.vehicle?.model?.message ??
							form.formState.errors.vehicle?.root?.message
						}
						label="Marque/Modèle/Année/Couleur"
						{...form.register('vehicle.model')}
					/>

					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						<TextField
							error={Boolean(form.formState.errors.vehicle?.license)}
							fullWidth
							disabled={disabled}
							helperText={form.formState.errors.vehicle?.license?.message}
							label="Plaque"
							{...form.register('vehicle.license')}
						/>
						<TextField
							error={Boolean(form.formState.errors.vehicle?.serial_number)}
							fullWidth
							disabled={disabled}
							helperText={form.formState.errors.vehicle?.serial_number?.message}
							label="Numéro de série"
							{...form.register('vehicle.serial_number')}
						/>
					</Box>

					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						<TextField
							type="number"
							error={Boolean(form.formState.errors.vehicle?.lengthh)}
							fullWidth
							disabled={disabled}
							helperText={form.formState.errors.vehicle?.lengthh?.message}
							InputProps={{
								endAdornment: <InputAdornment position="end">m</InputAdornment>,
							}}
							label="Longueur"
							{...form.register('vehicle.lengthh')}
						/>
						<TextField
							type="number"
							error={Boolean(form.formState.errors.vehicle?.width)}
							fullWidth
							disabled={disabled}
							helperText={form.formState.errors.vehicle?.width?.message}
							InputProps={{
								endAdornment: <InputAdornment position="end">m</InputAdornment>,
							}}
							label="Largeur"
							{...form.register('vehicle.width')}
						/>
					</Box>

					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						<TextField
							type="number"
							error={Boolean(form.formState.errors.vehicle?.height)}
							fullWidth
							disabled={disabled}
							helperText={form.formState.errors.vehicle?.height?.message}
							InputProps={{
								endAdornment: <InputAdornment position="end">m</InputAdornment>,
							}}
							label="Hauteur"
							{...form.register('vehicle.height')}
						/>
						<TextField
							type="number"
							error={Boolean(form.formState.errors.vehicle?.weight)}
							fullWidth
							disabled={disabled}
							helperText={form.formState.errors.vehicle?.weight?.message}
							InputProps={{
								endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
							}}
							label="Poids"
							{...form.register('vehicle.weight')}
						/>
					</Box>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CallFormVehicle;
