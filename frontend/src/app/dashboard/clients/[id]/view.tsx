'use client';

import type { FC } from 'react';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import ClientForm, { type ClientSubmitData } from 'src/components/clients/ClientForm';
import { useClientActions } from 'src/hooks/useClients';
import type { Client } from 'src/lib/types/directus';

type Props = {
	client: Client;
	sx?: SxProps;
};

const ClientPageView: FC<Props> = ({ client, sx }) => {
	const clientActions = useClientActions();

	const handleSubmit = async (data: ClientSubmitData) => {
		await clientActions.update(client.id, data);
	};

	return (
		<Box sx={sx}>
			{/* @ts-expect-error - data.company is a number. */}
			<ClientForm mode="update" defaultValues={client} onSubmit={handleSubmit} />
		</Box>
	);
};

export default ClientPageView;
