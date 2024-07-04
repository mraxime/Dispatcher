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

const CallFormOthers = () => {
	const form = useFormContext<CallInput>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.more />
						</SvgIcon>
						<Typography variant="h6">Autre</Typography>
					</Stack>
				}
			/>
			<Divider />

			<CardContent>
				<Stack spacing={3.5}>
					<TextField
						fullWidth
						multiline
						rows={4}
						label="Note formulaire d'appel"
						helperText={form.formState.errors.note?.message}
						error={Boolean(form.formState.errors.note)}
						{...form.register('note')}
					/>
					<TextField
						fullWidth
						multiline
						rows={4}
						label="Note facturation"
						helperText={form.formState.errors.billNote?.message}
						error={Boolean(form.formState.errors.billNote)}
						{...form.register('billNote')}
					/>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CallFormOthers;
