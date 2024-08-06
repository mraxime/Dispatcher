import type { FC } from 'react';
import {
	Box,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useFormContext } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import type { UserSubmitData } from './types';

type Props = {
	disabled?: boolean;
};

const UserFormLicense: FC<Props> = ({ disabled = false }) => {
	const form = useFormContext<UserSubmitData>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.contact />
						</SvgIcon>
						<Typography variant="h6">Fiche chauffeur</Typography>
					</Stack>
				}
			/>
			<Divider />
			<CardContent>
				<TextField
					error={Boolean(form.formState.errors.driver_license?.number)}
					fullWidth
					disabled={disabled}
					helperText={form.formState.errors.driver_license?.number?.message}
					label="Numéro de permis"
					{...form.register('driver_license.number')}
				/>
				<Box mt={4}>
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<TextField
								error={Boolean(form.formState.errors.driver_license?.class)}
								fullWidth
								disabled={disabled}
								helperText={form.formState.errors.driver_license?.class?.message}
								label="Classe du permis"
								{...form.register('driver_license.class')}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller
								control={form.control}
								name="driver_license.expiration_date"
								render={({ field }) => (
									<DatePicker
										disabled={disabled}
										value={field.value}
										onChange={field.onChange}
										slotProps={{
											textField: {
												label: 'Expiration du permis',
												fullWidth: true,
												name: field.name,
												onBlur: field.onBlur,
												error: Boolean(form.formState.errors.driver_license?.expiration_date),
												helperText: form.formState.errors.driver_license?.expiration_date?.message,
											},
										}}
									/>
								)}
							/>
						</Grid>
					</Grid>
				</Box>
				<Box mt={4}>
					<TextField
						error={Boolean(form.formState.errors.driver_license?.note)}
						fullWidth
						disabled={disabled}
						multiline
						rows={4}
						helperText={form.formState.errors.driver_license?.note?.message}
						label="Note"
						{...form.register('driver_license.note')}
					/>
				</Box>
				{/* TODO: CAPACITY */}
				{/* <Box mt={4}> */}
				{/* 	<Controller */}
				{/* 		control={control} */}
				{/* 		name="driver_license.capacity" */}
				{/* 		render={({ field }) => ( */}
				{/* 			<Autocomplete */}
				{/* 				multiple */}
				{/* 				fullWidth */}
				{/* 				options={Object.values(capacity)} */}
				{/* 				disableCloseOnSelect */}
				{/* 				getOptionLabel={(option) => option.name} */}
				{/* 				onChange={(_, value) => field.onChange(value)} */}
				{/* 				value={field.value} */}
				{/* 				renderOption={(_, { id, name }) => ( */}
				{/* 					<> */}
				{/* 						<Checkbox */}
				{/* 							icon={<CheckBoxOutlineBlankIcon fontSize="small" />} */}
				{/* 							checkedIcon={<CheckBoxIcon fontSize="small" />} */}
				{/* 							style={{ marginRight: 8 }} */}
				{/* 							checked={field.value?.some((value) => value.id === id)} */}
				{/* 						/> */}
				{/* 						{name} */}
				{/* 					</> */}
				{/* 				)} */}
				{/* 				renderInput={(params) => ( */}
				{/* 					<TextField {...params} label="Capacités" /> */}
				{/* 				)} */}
				{/* 			/> */}
				{/* 		)} */}
				{/* 	/> */}
				{/* </Box> */}
			</CardContent>
		</Card>
	);
};

export default UserFormLicense;
