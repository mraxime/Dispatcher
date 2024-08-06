import {
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
import type { CallSubmitData } from './types';

const CallFormAdress = () => {
	const form = useFormContext<CallSubmitData>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.location />
						</SvgIcon>
						<Typography variant="h6">Trajet</Typography>
					</Stack>
				}
			/>
			<Divider />

			<CardContent>
				<Stack spacing={3.5}>
					<TextField
						error={Boolean(form.formState.errors.address)}
						fullWidth
						required
						helperText={form.formState.errors.address?.message}
						label="Lieu de départ"
						{...form.register('address')}
					/>
					<TextField
						error={Boolean(form.formState.errors.destination)}
						fullWidth
						required
						helperText={form.formState.errors.destination?.message}
						label="Destination"
						{...form.register('destination')}
					/>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CallFormAdress;
