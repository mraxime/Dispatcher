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
import type { CallInput } from 'src/types';

const CallFormAdress = () => {
	const form = useFormContext<CallInput>();

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
						required
						fullWidth
						helperText={form.formState.errors.origin?.message}
						error={Boolean(form.formState.errors.origin)}
						label="Adresse de départ"
						{...form.register('origin')}
					/>
					<TextField
						required
						fullWidth
						label="Adresse de la panne"
						helperText={form.formState.errors.checkpoint?.message}
						error={Boolean(form.formState.errors.checkpoint)}
						{...form.register('checkpoint')}
					/>
					<TextField
						required
						fullWidth
						label="Adresse de destination"
						helperText={form.formState.errors.destination?.message}
						error={Boolean(form.formState.errors.destination)}
						{...form.register('destination')}
					/>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CallFormAdress;
