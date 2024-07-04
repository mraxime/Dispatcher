import type { FC } from 'react';
import {
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
import type { TowingInput } from 'src/types';

const TowingFormMeasures: FC = () => {
	const form = useFormContext<TowingInput>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.measure />
						</SvgIcon>
						<Typography variant="h6">Dimensions et poids</Typography>
					</Stack>
				}
			/>
			<Divider />
			<CardContent component={Stack} spacing={3.5}>
				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<TextField
						error={Boolean(form.formState.errors.plateLength)}
						fullWidth
						helperText={form.formState.errors.plateLength?.message}
						label="Longueur plate"
						type="number"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Typography>m</Typography>
								</InputAdornment>
							),
						}}
						{...form.register('plateLength')}
					/>
					<TextField
						error={Boolean(form.formState.errors.plateHeight)}
						fullWidth
						helperText={form.formState.errors.plateHeight?.message}
						label="Hauteur plate"
						type="number"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Typography>m</Typography>
								</InputAdornment>
							),
						}}
						{...form.register('plateHeight')}
					/>
				</Stack>

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<TextField
						error={Boolean(form.formState.errors.totalLength)}
						fullWidth
						helperText={form.formState.errors.totalLength?.message}
						label="Longueur totale"
						type="number"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Typography>m</Typography>
								</InputAdornment>
							),
						}}
						{...form.register('totalLength')}
					/>
					<TextField
						error={Boolean(form.formState.errors.totalHeight)}
						fullWidth
						helperText={form.formState.errors.totalHeight?.message}
						label="Hauteur totale"
						type="number"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Typography>m</Typography>
								</InputAdornment>
							),
						}}
						{...form.register('totalHeight')}
					/>
				</Stack>

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<TextField
						error={Boolean(form.formState.errors.capacity)}
						fullWidth
						helperText={form.formState.errors.capacity?.message}
						label="Capacité poids"
						type="number"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Typography>kg</Typography>
								</InputAdornment>
							),
						}}
						{...form.register('capacity')}
					/>
					<TextField
						error={Boolean(form.formState.errors.capacityThaw)}
						fullWidth
						helperText={form.formState.errors.capacityThaw?.message}
						label="Capacité poids dégel"
						type="number"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Typography>kg</Typography>
								</InputAdornment>
							),
						}}
						{...form.register('capacityThaw')}
					/>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default TowingFormMeasures;
