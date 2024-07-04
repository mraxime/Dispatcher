import type { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Divider,
	Grow,
	Modal,
	Stack,
	SvgIcon,
	Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Icons } from 'src/components/base/Icons';
import TowingSearchInput from 'src/components/towing/TowingSearchInput';
import UserSearchInput from 'src/components/user/UserSearchInput';
import type { Towing, User } from 'src/types';

type Props = {
	isOpen: boolean;
	drivers: User[];
	towings: Towing[];
	defaultValues?: Partial<FormData>;
	onSelect: (driver: User, towing: Towing) => void;
	onClose?: () => void;
};

const schema = z.object({
	driverId: z.string({ invalid_type_error: 'Requis', required_error: 'Requis' }).min(1).nullable(),
	towingId: z.string({ invalid_type_error: 'Requis', required_error: 'Requis' }).min(1).nullable(),
});

type FormData = z.infer<typeof schema>;

const DriverSelectorModal: FC<Props> = ({
	isOpen,
	drivers,
	towings,
	defaultValues,
	onClose,
	onSelect,
}) => {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			driverId: defaultValues?.driverId,
			towingId: defaultValues?.towingId,
		},
	});

	const handleSubmit = form.handleSubmit((formValues) => {
		const driver = drivers.find(({ id }) => id === formValues.driverId);
		const towing = towings.find(({ id }) => id === formValues.towingId);
		if (!driver || !towing) return;

		onSelect(driver, towing);
	});

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Grow in={isOpen}>
				<Box maxWidth="sm" width="100%">
					<form onSubmit={handleSubmit} noValidate>
						<Card>
							<CardHeader
								title={
									<Stack direction="row" alignItems="center" spacing={1}>
										<SvgIcon color="primary">
											<Icons.contact />
										</SvgIcon>
										<Typography variant="h6">Choix du chauffeur / remorque</Typography>
									</Stack>
								}
							/>
							<Divider />
							<CardContent>
								<Stack spacing={4}>
									<Controller
										name="driverId"
										control={form.control}
										render={({ field, fieldState }) => (
											<UserSearchInput
												label="Chauffeur"
												items={drivers}
												current={field.value}
												onSelect={(user) => field.onChange(user?.id ?? null)}
												error={fieldState.error?.message}
											/>
										)}
									/>
									<Controller
										name="towingId"
										control={form.control}
										render={({ field, fieldState }) => (
											<TowingSearchInput
												label="Remorque"
												items={towings}
												current={field.value}
												onSelect={(towing) => field.onChange(towing?.id ?? null)}
												error={fieldState.error?.message}
											/>
										)}
									/>
								</Stack>
							</CardContent>
							<Divider sx={{ my: 1 }} />
							<CardActions sx={{ justifyContent: 'right' }}>
								<Button color="inherit" onClick={onClose} disableRipple>
									Annuler
								</Button>
								<Button
									type="submit"
									color="primary"
									variant="contained"
									onClick={handleSubmit}
									disableRipple
								>
									Confirmer
								</Button>
							</CardActions>
						</Card>
					</form>
				</Box>
			</Grow>
		</Modal>
	);
};

export default DriverSelectorModal;
