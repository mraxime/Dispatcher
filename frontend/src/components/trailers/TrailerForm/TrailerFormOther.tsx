import type { FC } from 'react';
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
import { Controller, useFormContext } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import type { TrailerSubmitData } from './types';

const TrailerFormOther: FC = () => {
	const form = useFormContext<TrailerSubmitData>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.more />
						</SvgIcon>
						<Typography variant="h6">Autres</Typography>
					</Stack>
				}
			/>
			<Divider />
			<CardContent component={Stack} spacing={3.5}>
				<TextField
					error={Boolean(form.formState.errors.brake_type)}
					fullWidth
					helperText={form.formState.errors.brake_type?.message}
					label="Type de frein"
					{...form.register('brake_type')}
				/>

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<Controller
						control={form.control}
						name="container"
						render={({ field }) => (
							<TextField
								error={Boolean(form.formState.errors.container)}
								fullWidth
								helperText={form.formState.errors.container?.message}
								label="Conteneur"
								select
								SelectProps={{ native: true }}
								onBlur={field.onBlur}
								onChange={(e) => field.onChange(e.target.value === 'oui')}
								value={field.value === true ? 'oui' : 'non'}
							>
								<option value="non">Non</option>
								<option value="oui">Oui</option>
							</TextField>
						)}
					/>
					<Controller
						control={form.control}
						name="gps"
						render={({ field }) => (
							<TextField
								error={Boolean(form.formState.errors.gps)}
								fullWidth
								helperText={form.formState.errors.gps?.message}
								label="GPS installé"
								select
								SelectProps={{ native: true }}
								onBlur={field.onBlur}
								onChange={(e) => field.onChange(e.target.value === 'oui')}
								value={field.value === true ? 'oui' : 'non'}
							>
								<option value="non">Non</option>
								<option value="oui">Oui</option>
							</TextField>
						)}
					/>
				</Stack>

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<Controller
						control={form.control}
						name="wheel_lift"
						render={({ field }) => (
							<TextField
								error={Boolean(form.formState.errors.wheel_lift)}
								fullWidth
								helperText={form.formState.errors.wheel_lift?.message}
								label="Wheel lift"
								name="other_wheel_lift"
								onBlur={field.onBlur}
								select
								SelectProps={{ native: true }}
								onChange={(e) => field.onChange(e.target.value === 'oui')}
								value={field.value === true ? 'oui' : 'non'}
							>
								<option value="non">Non</option>
								<option value="oui">Oui</option>
							</TextField>
						)}
					/>
					<Controller
						control={form.control}
						name="ifta"
						render={({ field }) => (
							<TextField
								error={Boolean(form.formState.errors.ifta)}
								fullWidth
								helperText={form.formState.errors.ifta?.message}
								label="IFTA (ontario)"
								name="other_ifta"
								onBlur={field.onBlur}
								select
								SelectProps={{ native: true }}
								onChange={(e) => field.onChange(e.target.value === 'oui')}
								value={field.value === true ? 'oui' : 'non'}
							>
								<option value="non">Non</option>
								<option value="oui">Oui</option>
							</TextField>
						)}
					/>
				</Stack>

				<TextField
					error={Boolean(form.formState.errors.note)}
					fullWidth
					multiline
					rows={4}
					helperText={form.formState.errors.note?.message}
					label="Note"
					{...form.register('note')}
				/>
			</CardContent>
		</Card>
	);
};

export default TrailerFormOther;
