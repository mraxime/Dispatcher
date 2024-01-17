'use client';

import type { FC } from 'react';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import CompaniesTable from 'src/components/companies/CompaniesTable';
import { useCompanyActions } from 'src/hooks/useCompanies';
import type { Company, CompanyParams } from 'src/lib/types/directus';

type Props = {
	companies: Company[];
	params: CompanyParams;
	sx?: SxProps;
};

const CompaniesPageView: FC<Props> = ({ companies, params, sx }) => {
	const actions = useCompanyActions();

	return (
		<Box sx={sx}>
			<CompaniesTable
				data={companies}
				params={params}
				onDelete={actions.delete}
				onRefresh={actions.revalidate}
				onParamsChange={actions.setParams}
			/>
		</Box>
	);
};

export default CompaniesPageView;
