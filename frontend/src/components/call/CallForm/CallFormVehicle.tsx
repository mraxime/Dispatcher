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
import type { CallInput } from 'src/types';

const CallFormVehicle: FC = () => {
	const form = useFormContext<CallInput>();

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
						required
						fullWidth
						label="Marque/Modèle/Année/Couleur"
						helperText={
							form.formState.errors.vehicle?.model?.message ??
							form.formState.errors.vehicle?.root?.message
						}
						error={
							Boolean(form.formState.errors.vehicle?.model) ||
							Boolean(form.formState.errors.vehicle?.root)
						}
						{...form.register('vehicle.model')}
					/>

					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						<TextField
							fullWidth
							label="Plaque"
							helperText={form.formState.errors.vehicle?.license?.message}
							error={Boolean(form.formState.errors.vehicle?.license)}
							{...form.register('vehicle.license')}
						/>
						<TextField
							fullWidth
							label="Numéro de série"
							helperText={form.formState.errors.vehicle?.serialNb?.message}
							error={Boolean(form.formState.errors.vehicle?.serialNb)}
							{...form.register('vehicle.serialNb')}
						/>
					</Box>

					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						<TextField
							type="number"
							fullWidth
							label="Longueur"
							helperText={form.formState.errors.vehicle?.length?.message}
							error={Boolean(form.formState.errors.vehicle?.length)}
							InputProps={{
								endAdornment: <InputAdornment position="end">m</InputAdornment>,
							}}
							{...form.register('vehicle.length')}
						/>
						<TextField
							type="number"
							fullWidth
							label="Largeur"
							helperText={form.formState.errors.vehicle?.width?.message}
							error={Boolean(form.formState.errors.vehicle?.width)}
							InputProps={{
								endAdornment: <InputAdornment position="end">m</InputAdornment>,
							}}
							{...form.register('vehicle.width')}
						/>
					</Box>

					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						<TextField
							type="number"
							fullWidth
							label="Hauteur"
							helperText={form.formState.errors.vehicle?.height?.message}
							error={Boolean(form.formState.errors.vehicle?.height)}
							InputProps={{
								endAdornment: <InputAdornment position="end">m</InputAdornment>,
							}}
							{...form.register('vehicle.height')}
						/>
						<TextField
							type="number"
							fullWidth
							label="Poids"
							helperText={form.formState.errors.vehicle?.weight?.message}
							error={Boolean(form.formState.errors.vehicle?.weight)}
							InputProps={{
								endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
							}}
							{...form.register('vehicle.weight')}
						/>
					</Box>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CallFormVehicle;
