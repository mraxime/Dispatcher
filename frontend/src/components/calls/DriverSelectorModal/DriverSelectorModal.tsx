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
import TrailerSearchInput from 'src/components/trailers/TrailerSearchInput';
import UserSearchInput from 'src/components/users/UserSearchInput';
import type { Trailer, User } from 'src/lib/types/directus';

type Props = {
	isOpen: boolean;
	drivers: User[];
	trailers: Trailer[];
	defaultValues?: { driver: string | null; trailer: number | null };
	onSelect: (driver: User, trailer: Trailer) => void;
	onClose?: () => void;
};

const schema = z.object({
	driver: z.string({ invalid_type_error: 'Requis', required_error: 'Requis' }).min(1),
	trailer: z.number({ invalid_type_error: 'Requis', required_error: 'Requis' }).int(),
});

const DriverSelectorModal: FC<Props> = ({
	isOpen,
	drivers,
	trailers,
	defaultValues,
	onClose,
	onSelect,
}) => {
	const form = useForm<{ driver: string | null; trailer: number | null }>({
		resolver: zodResolver(schema),
		defaultValues: {
			driver: defaultValues?.driver,
			trailer: defaultValues?.trailer,
		},
	});

	const handleSubmit = form.handleSubmit((formValues) => {
		const driver = drivers.find(({ id }) => id === formValues.driver);
		const trailer = trailers.find(({ id }) => id === formValues.trailer);
		if (!driver || !trailer) return;

		onSelect(driver, trailer);
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
										name="driver"
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
										name="trailer"
										control={form.control}
										render={({ field, fieldState }) => (
											<TrailerSearchInput
												label="Remorque"
												items={trailers}
												current={field.value}
												onSelect={(trailer) => field.onChange(trailer?.id ?? null)}
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
