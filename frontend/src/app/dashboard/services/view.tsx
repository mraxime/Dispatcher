'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import ServicesTable from 'src/components/services/ServicesTable';
import { useServiceActions } from 'src/hooks/useServices';
import { ROUTES } from 'src/lib/constants/routes';
import type { Service, ServiceParams } from 'src/lib/types/directus';

type Props = {
	services: Service[];
	params: ServiceParams;
	sx?: SxProps;
};

const ServicesPageView: FC<Props> = ({ services, params, sx }) => {
	const router = useRouter();
	const serviceActions = useServiceActions();

	return (
		<Box sx={sx}>
			<ServicesTable
				data={services}
				params={params}
				onRefresh={serviceActions.revalidate}
				onParamsChange={serviceActions.setParams}
				onEdit={(id) => router.push(ROUTES.ServicePage(id))}
				onDelete={serviceActions.delete}
			/>
		</Box>
	);
};

export default ServicesPageView;
