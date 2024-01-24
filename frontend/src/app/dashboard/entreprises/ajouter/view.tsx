'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import Cookies from 'js-cookie';

import CompanyForm from 'src/components/companies/CompanyForm';
import { useCompanyActions } from 'src/hooks/useCompanies';
import { ROUTES } from 'src/lib/constants/routes';
import type { CreateCompanySchema } from 'src/lib/schemas/company.schema';
import type { Company } from 'src/lib/types/directus';

type Props = {
	companies: Company[];
	sx?: SxProps;
};

const NewCompanyPageView: FC<Props> = ({ companies, sx }) => {
	const router = useRouter();
	const companyActions = useCompanyActions();
	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: CreateCompanySchema) => {
		await companyActions.create(data);
		router.push(ROUTES.CompaniesPage());
	};

	return (
		<Box sx={sx}>
			<CompanyForm
				mode="create"
				companies={companies}
				defaultValues={{
					parent_company: Number(companyCookie),
					admin: { company: Number(companyCookie) },
				}}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default NewCompanyPageView;
