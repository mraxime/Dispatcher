import type { FC } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	InputAdornment,
	Stack,
	SvgIcon,
	TextField,
	Typography,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import type { TrailerSubmitData } from './types';

const TrailerFormMeasures: FC = () => {
	const form = useFormContext<TrailerSubmitData>();

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
			<CardContent>
				<Grid container spacing={3.5}>
					<Grid item xs={12} md={6}>
						<TextField
							error={Boolean(form.formState.errors.plate_length)}
							fullWidth
							helperText={form.formState.errors.plate_length?.message}
							label="Longueur plate"
							type="number"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Typography>m</Typography>
									</InputAdornment>
								),
							}}
							{...form.register('plate_length')}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							error={Boolean(form.formState.errors.plate_height)}
							fullWidth
							helperText={form.formState.errors.plate_height?.message}
							label="Hauteur plate"
							type="number"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Typography>m</Typography>
									</InputAdornment>
								),
							}}
							{...form.register('plate_height')}
						/>
					</Grid>
				</Grid>
				<Box mt={3.5}>
					<Grid container spacing={3.5}>
						<Grid item xs={12} md={6}>
							<TextField
								error={Boolean(form.formState.errors.total_length)}
								fullWidth
								helperText={form.formState.errors.total_length?.message}
								label="Longueur totale"
								type="number"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Typography>m</Typography>
										</InputAdornment>
									),
								}}
								{...form.register('total_length')}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								error={Boolean(form.formState.errors.total_height)}
								fullWidth
								helperText={form.formState.errors.total_height?.message}
								label="Hauteur totale"
								type="number"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Typography>m</Typography>
										</InputAdornment>
									),
								}}
								{...form.register('total_height')}
							/>
						</Grid>
					</Grid>
				</Box>
				<Box mt={3.5}>
					<Grid container spacing={3.5}>
						<Grid item xs={12} md={6}>
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
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								error={Boolean(form.formState.errors.capacity_thaw)}
								fullWidth
								helperText={form.formState.errors.capacity_thaw?.message}
								label="Capacité poids dégel"
								type="number"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Typography>kg</Typography>
										</InputAdornment>
									),
								}}
								{...form.register('capacity_thaw')}
							/>
						</Grid>
					</Grid>
				</Box>
			</CardContent>
		</Card>
	);
};

export default TrailerFormMeasures;
