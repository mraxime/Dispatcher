import type { FC } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Stack,
	SvgIcon,
	Typography,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import TrailerSearchInput from 'src/components/trailers/TrailerSearchInput';
import UserSearchInput from 'src/components/users/UserSearchInput';
import type { Trailer, User } from 'src/lib/types/directus';
import type { CallSubmitData } from './types';

type Props = {
	disabled?: boolean;
	drivers: User[];
	trailers: Trailer[];
};

const CallFormDriver: FC<Props> = ({ disabled = false, drivers, trailers }) => {
	const form = useFormContext<CallSubmitData>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.contact />
						</SvgIcon>
						<Typography variant="h6">Choix du chauffeur / remorque</Typography>
					</Stack>
				}
			/>
			<Divider />

			<CardContent>
				<Stack spacing={3.5}>
					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						{drivers && (
							<Controller
								control={form.control}
								name="driver"
								render={({ field, fieldState }) => (
									<UserSearchInput
										label="Chauffeur"
										items={drivers}
										disabled={disabled}
										current={field.value}
										onSelect={(user) => field.onChange(user?.id ?? null)}
										error={fieldState.error?.message}
									/>
								)}
							/>
						)}
						<Controller
							control={form.control}
							name="driver_truck"
							render={({ field, fieldState }) => (
								<TrailerSearchInput
									items={trailers}
									disabled={disabled}
									current={field.value}
									onSelect={(trailer) => field.onChange(trailer?.id ?? null)}
									error={fieldState.error?.message}
								/>
							)}
						/>
					</Box>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default CallFormDriver;
