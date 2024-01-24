'use client';

import type { FC } from 'react';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import CompanyForm, { type CompanySubmitData } from 'src/components/companies/CompanyForm';
import { useCompanyActions } from 'src/hooks/useCompanies';
import type { Company } from 'src/lib/types/directus';

type Props = {
	company: Company;
	companies: Company[];
	sx: SxProps;
};

const CompanyPageView: FC<Props> = ({ company, companies, sx }) => {
	const companyActions = useCompanyActions();

	const handleSubmit = async (data: CompanySubmitData) => {
		await companyActions.update(company.id, data);
	};

	return (
		<Box sx={sx}>
			<CompanyForm
				mode="update"
				companies={companies}
				/* @ts-expect-error - data.company is a number. */
				defaultValues={company}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default CompanyPageView;
