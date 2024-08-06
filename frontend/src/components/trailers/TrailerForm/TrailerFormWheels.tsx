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
import { GiCartwheel as WheelIcon } from 'react-icons/gi';

import type { TrailerSubmitData } from './types';

const TrailerFormWheels: FC = () => {
	const form = useFormContext<TrailerSubmitData>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<WheelIcon />
						</SvgIcon>
						<Typography variant="h6">Roues</Typography>
					</Stack>
				}
			/>
			<Divider />
			<CardContent>
				<TextField
					error={Boolean(form.formState.errors.nb)}
					fullWidth
					helperText={form.formState.errors.nb?.message}
					label="Nombre de roues"
					type="number"
					{...form.register('nb')}
				/>
				<Box mt={3.5}>
					<Grid container spacing={3.5}>
						<Grid item xs={12} md={6}>
							<TextField
								error={Boolean(form.formState.errors.capacity_front)}
								fullWidth
								helperText={form.formState.errors.capacity_front?.message}
								label="Capacité pneu avant"
								type="number"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Typography>kg</Typography>
										</InputAdornment>
									),
								}}
								{...form.register('capacity_front')}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								error={Boolean(form.formState.errors.capacity_back)}
								fullWidth
								helperText={form.formState.errors.capacity_back?.message}
								label="Capacité pneu arrière"
								type="number"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Typography>kg</Typography>
										</InputAdornment>
									),
								}}
								{...form.register('capacity_back')}
							/>
						</Grid>
					</Grid>
				</Box>
			</CardContent>
		</Card>
	);
};

export default TrailerFormWheels;
