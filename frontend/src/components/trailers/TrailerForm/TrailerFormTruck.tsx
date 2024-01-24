import type { FC } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	Divider,
	FormControlLabel,
	InputAdornment,
	Stack,
	SvgIcon,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { capitalCase } from 'change-case';
import { Controller, useFormContext } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import CompanySelectInput from 'src/components/companies/CompanySelectInput';
import { TRAILER_TYPES_MAP } from 'src/lib/constants/trailers';
import type { Company } from 'src/lib/types/directus';
import type { TrailerSubmitData } from './types';

type Props = {
	isNew?: boolean;
	companies: Company[];
};

const TrailerFormTruck: FC<Props> = ({ isNew, companies }) => {
	const form = useFormContext<TrailerSubmitData>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.trailer />
						</SvgIcon>
						<Typography variant="h6">Remorque</Typography>
					</Stack>
				}
			/>
			<Divider />
			<CardContent component={Stack} spacing={3.5}>
				<Controller
					name="company"
					control={form.control}
					render={({ field }) => (
						<CompanySelectInput
							{...field}
							label="Appartient à"
							items={companies}
							onSelect={(company) => field.onChange(company.id)}
						/>
					)}
				/>

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<TextField
						autoFocus={isNew}
						error={Boolean(form.formState.errors.name)}
						fullWidth
						required
						helperText={form.formState.errors.name?.message}
						label="Nom de la remorque"
						{...form.register('name')}
					/>
					<Controller
						control={form.control}
						name="type"
						render={({ field }) => (
							<TextField
								error={Boolean(form.formState.errors.type)}
								fullWidth
								helperText={form.formState.errors.type?.message}
								label="Type de remorque"
								name="type"
								onBlur={field.onBlur}
								onChange={field.onChange}
								select
								SelectProps={{ native: true }}
								value={field.value}
							>
								{Object.values(TRAILER_TYPES_MAP).map((t) => (
									<option key={t.value} value={t.value}>
										{capitalCase(t.title)}
									</option>
								))}
							</TextField>
						)}
					/>
				</Stack>

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<TextField
						error={Boolean(form.formState.errors.model)}
						fullWidth
						helperText={form.formState.errors.model?.message}
						label="Marque/Modèle/Année"
						{...form.register('model')}
					/>
					<TextField
						error={Boolean(form.formState.errors.weight)}
						fullWidth
						helperText={form.formState.errors.weight?.message}
						label="Masse net"
						type="number"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Typography>kg</Typography>
								</InputAdornment>
							),
						}}
						{...form.register('weight')}
					/>
				</Stack>

				<Stack direction={{ sm: 'row' }} gap={3.5}>
					<TextField
						error={Boolean(form.formState.errors.serial_nb)}
						fullWidth
						helperText={form.formState.errors.serial_nb?.message}
						label="Numéro de série"
						{...form.register('serial_nb')}
					/>
					<TextField
						error={Boolean(form.formState.errors.plate_nb)}
						fullWidth
						helperText={form.formState.errors.plate_nb?.message}
						label="Numéro de plaque"
						{...form.register('plate_nb')}
					/>
				</Stack>

				<Controller
					control={form.control}
					name="in_service"
					render={({ field }) => (
						<FormControlLabel
							control={
								<Switch checked={field.value} onChange={(_, value) => field.onChange(value)} />
							}
							label="En service"
						/>
					)}
				/>
			</CardContent>
		</Card>
	);
};

export default TrailerFormTruck;
