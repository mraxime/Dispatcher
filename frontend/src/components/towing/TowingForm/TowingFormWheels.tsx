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
import type { TowingInput } from 'src/types';

const TowingFormWheels: FC = () => {
	const form = useFormContext<TowingInput>();

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
					error={Boolean(form.formState.errors.wheelCount)}
					fullWidth
					helperText={form.formState.errors.wheelCount?.message}
					label="Nombre de roues"
					type="number"
					{...form.register('wheelCount')}
				/>

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<TextField
						error={Boolean(form.formState.errors.capacityFront)}
						fullWidth
						helperText={form.formState.errors.capacityFront?.message}
						label="Capacité pneu avant"
						type="number"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Typography>kg</Typography>
								</InputAdornment>
							),
						}}
						{...form.register('capacityFront')}
					/>
					<TextField
						error={Boolean(form.formState.errors.capacityBack)}
						fullWidth
						helperText={form.formState.errors.capacityBack?.message}
						label="Capacité pneu arrière"
						type="number"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Typography>kg</Typography>
								</InputAdornment>
							),
						}}
						{...form.register('capacityBack')}
					/>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default TowingFormWheels;
