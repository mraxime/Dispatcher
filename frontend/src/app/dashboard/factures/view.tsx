'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import BillsTable from 'src/components/bills/BillsTable';
import { useBillActions } from 'src/hooks/useBills';
import { ROUTES } from 'src/lib/constants/routes';
import type { Bill, BillParams } from 'src/lib/types/directus';

type Props = {
	bills: Bill[];
	params: BillParams;
	sx?: SxProps;
};

const BillsPageView: FC<Props> = ({ bills, params, sx }) => {
	const router = useRouter();
	const billActions = useBillActions();

	return (
		<Box sx={sx}>
			<BillsTable
				data={bills}
				params={params}
				onRefresh={billActions.revalidate}
				onParamsChange={billActions.setParams}
				onEdit={(id) => router.push(ROUTES.BillPage(id))}
				onDelete={billActions.delete}
			/>
		</Box>
	);
};

export default BillsPageView;
