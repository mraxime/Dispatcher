import type { FC } from 'react';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grow,
	IconButton,
	Modal,
	Stack,
	SvgIcon,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import ServiceSearchInput from 'src/components/services/ServiceSearchInput';
import UsersAsideList from 'src/components/users/UsersAsideList';
import useDisclosure from 'src/hooks/useDisclosure';
import type { Client, Service } from 'src/lib/types/directus';
import type { CallSubmitData } from './types';

type Props = {
	isNew?: boolean;
	services?: Service[];
	clients?: Client[];
};

const CallFormClient: FC<Props> = ({ isNew, services = [], clients = [] }) => {
	const form = useFormContext<CallSubmitData>();
	const disclosure = useDisclosure();

	const handleClientSelect = (client: Client) => {
		form.setValue('name', client.name, { shouldDirty: true });
		form.setValue('phone', client.phone ?? '', { shouldDirty: true });
		disclosure.close();
	};

	return (
		<>
			<Card>
				<CardHeader
					title={
						<Stack direction="row" alignItems="center" spacing={1}>
							<SvgIcon fontSize="small" color="primary">
								<Icons.client />
							</SvgIcon>
							<Typography variant="h6">Client</Typography>
						</Stack>
					}
					action={
						<Tooltip title="Client existant">
							<IconButton color="primary" onClick={disclosure.open}>
								<SettingsSuggestIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					}
				/>
				<Divider />

				<CardContent>
					<Stack spacing={3.5}>
						<Box display="grid" gap={3.5} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
							<TextField
								autoFocus={isNew}
								error={Boolean(form.formState.errors.name)}
								fullWidth
								required
								helperText={form.formState.errors.name?.message}
								label="Nom du client sur la route"
								{...form.register('name')}
							/>
							<TextField
								error={Boolean(form.formState.errors.phone)}
								fullWidth
								required
								helperText={form.formState.errors.phone?.message}
								label="Téléphone du client sur la route"
								{...form.register('phone')}
							/>
						</Box>

						<Controller
							control={form.control}
							name="service"
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
					</Stack>
				</CardContent>
			</Card>

			<Modal
				open={disclosure.isOpen}
				onClose={disclosure.close}
				sx={{ display: 'flex', alignItems: 'start', justifyContent: 'center' }}
				closeAfterTransition
			>
				<Grow in={disclosure.isOpen}>
					<Box maxWidth="sm" width="100%" mt="10%">
						<UsersAsideList
							title="Clients existants"
							data={clients}
							onSelect={handleClientSelect}
							onClose={disclosure.close}
						/>
					</Box>
				</Grow>
			</Modal>
		</>
	);
};

export default CallFormClient;
