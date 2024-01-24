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
			<CardContent component={Stack} spacing={3.5}>
				<TextField
					error={Boolean(form.formState.errors.nb)}
					fullWidth
					helperText={form.formState.errors.nb?.message}
					label="Nombre de roues"
					type="number"
					{...form.register('nb')}
				/>

				<Stack direction={{ sm: 'row' }} gap={3.5}>
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
				</Stack>
			</CardContent>
		</Card>
	);
};

export default TrailerFormWheels;
