'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import ClientsTable from 'src/components/clients/ClientsTable';
import { useClientActions } from 'src/hooks/useClients';
import { ROUTES } from 'src/lib/constants/routes';
import type { Client, ClientParams } from 'src/lib/types/directus';

type Props = {
	clients: Client[];
	params: ClientParams;
	sx?: SxProps;
};

const ClientsPageView: FC<Props> = ({ clients, params, sx }) => {
	const router = useRouter();
	const clientActions = useClientActions();

	return (
		<Box sx={sx}>
			<ClientsTable
				data={clients}
				params={params}
				onRefresh={clientActions.revalidate}
				onParamsChange={clientActions.setParams}
				onEdit={(id) => router.push(ROUTES.ClientPage(id))}
				onDelete={clientActions.delete}
			/>
		</Box>
	);
};

export default ClientsPageView;
