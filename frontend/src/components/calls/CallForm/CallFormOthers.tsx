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

const CallFormOthers = () => {
	const form = useFormContext<CallSubmitData>();

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
						error={Boolean(form.formState.errors.note)}
						fullWidth
						multiline
						rows={4}
						helperText={form.formState.errors.note?.message}
						label="Note formulaire d'appel"
						{...form.register('note')}
					/>
					<TextField
						error={Boolean(form.formState.errors.bill_note)}
						fullWidth
						multiline
						rows={4}
						helperText={form.formState.errors.bill_note?.message}
						label="Note facturation"
						{...form.register('bill_note')}
					/>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CallFormOthers;
