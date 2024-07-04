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
import { useFormContext } from 'react-hook-form';
import { Icons } from 'src/components/base/Icons';
import UsersAsideList from 'src/components/user/UsersAsideList';
import useDisclosure from 'src/hooks/useDisclosure';
import type { CallInput, Client } from 'src/types';

type Props = {
	clients: Client[];
};

const CallFormClient: FC<Props> = ({ clients }) => {
	const form = useFormContext<CallInput>();
	const disclosure = useDisclosure();

	const handleClientSelect = (client: Client) => {
		form.setValue('clientId', client.id, { shouldDirty: true });
		form.setValue('client', client, { shouldDirty: true });
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
								fullWidth
								required
								label="Prénom"
								helperText={form.formState.errors.client?.firstName?.message}
								error={Boolean(form.formState.errors.client?.firstName)}
								{...form.register('client.firstName')}
							/>
							<TextField
								fullWidth
								label="Nom"
								helperText={form.formState.errors.client?.lastName?.message}
								error={Boolean(form.formState.errors.client?.lastName)}
								{...form.register('client.lastName')}
							/>
						</Box>

						<TextField
							fullWidth
							required
							label="Téléphone"
							helperText={form.formState.errors.client?.phone?.message}
							error={Boolean(form.formState.errors.client?.phone)}
							{...form.register('client.phone')}
						/>

						<TextField
							fullWidth
							label="Courriel"
							helperText={form.formState.errors.client?.email?.message}
							error={Boolean(form.formState.errors.client?.email)}
							{...form.register('client.email')}
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
						{/* TODO: Create a similar component `ClientsAsideList` */}
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
