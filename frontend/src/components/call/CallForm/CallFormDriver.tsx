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
import ServiceSearchInput from 'src/components/service/ServiceSearchInput';
import TowingSearchInput from 'src/components/towing/TowingSearchInput';
import UserSearchInput from 'src/components/user/UserSearchInput';
import type { CallInput, Service, Towing, User } from 'src/types';

type Props = {
	disabled?: boolean;
	drivers: User[];
	services: Service[];
	towings: Towing[];
};

const CallFormDriver: FC<Props> = ({ disabled = false, drivers, services, towings }) => {
	const form = useFormContext<CallInput>();

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon fontSize="small" color="primary">
							<Icons.contact />
						</SvgIcon>
						<Typography variant="h6">Choix du service</Typography>
					</Stack>
				}
			/>
			<Divider />

			<CardContent>
				<Stack spacing={3.5}>
					<Controller
						control={form.control}
						name="serviceId"
						render={({ field, fieldState }) => (
							<ServiceSearchInput
								required
								items={services}
								current={field.value}
								onSelect={(service) => field.onChange(service?.id)}
								error={fieldState.error?.message}
							/>
						)}
					/>

					<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
						{drivers && (
							<Controller
								control={form.control}
								name="driverId"
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
							name="towingId"
							render={({ field, fieldState }) => (
								<TowingSearchInput
									items={towings}
									disabled={disabled}
									current={field.value}
									onSelect={(towing) => field.onChange(towing?.id ?? null)}
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
