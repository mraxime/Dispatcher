import type { FC } from 'react';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import {
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	Stack,
	SvgIcon,
	TextField,
	Typography,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import type { UserSubmitData } from './types';

type Props = {
	disabled?: boolean;
};

const UserFormContact: FC<Props> = ({ disabled = false }) => {
	const form = useFormContext<UserSubmitData>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<LocalHospitalOutlinedIcon />
						</SvgIcon>
						<Typography variant="h6">Contact d'urgence</Typography>
					</Stack>
				}
			/>
			<Divider />
			<CardContent component={Stack} spacing={4}>
				<Stack direction={{ sm: 'row' }} gap={4}>
					<TextField
						// error={Boolean(form.formState.errors.emergency_contact?.first_name)}
						fullWidth
						disabled={disabled}
						// helperText={form.formState.errors.emergency_contact?.first_name?.message}
						label="Prénom"
						// {...form.register('emergency_contact.first_name')}
					/>
					<TextField
						// error={Boolean(form.formState.errors.emergency_contact?.last_name)}
						fullWidth
						disabled={disabled}
						// helperText={form.formState.errors.emergency_contact?.last_name?.message}
						label="Nom"
						// {...form.register('emergency_contact.last_name')}
					/>
				</Stack>

				<TextField
					// error={Boolean(form.formState.errors.emergency_contact?.relation)}
					fullWidth
					disabled={disabled}
					// helperText={form.formState.errors.emergency_contact?.relation?.message}
					label="Relation"
					// {...form.register('emergency_contact.relation')}
				/>

				<div>
					<Grid container spacing={4}>
						<Grid item xs={12} md={8}>
							<TextField
								// error={Boolean(form.formState.errors.emergency_contact?.phone)}
								fullWidth
								disabled={disabled}
								// helperText={form.formState.errors.emergency_contact?.phone?.message}
								label="Téléphone"
								// {...form.register('emergency_contact.phone')}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<TextField
								// error={Boolean(form.formState.errors.emergency_contact?.ext)}
								fullWidth
								disabled={disabled}
								// helperText={form.formState.errors.emergency_contact?.ext?.message}
								label="Poste"
								// {...form.register('emergency_contact.ext')}
							/>
						</Grid>
					</Grid>
				</div>

				<TextField
					// error={Boolean(form.formState.errors.emergency_contact?.note)}
					fullWidth
					disabled={disabled}
					multiline
					rows={4}
					// helperText={form.formState.errors.emergency_contact?.note?.message}
					label="Note"
					// {...form.register('emergency_contact.note')}
				/>
			</CardContent>
		</Card>
	);
};

export default UserFormContact;
