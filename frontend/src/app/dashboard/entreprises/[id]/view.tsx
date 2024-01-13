'use client';

import type { FC } from 'react';
import { Box, Container } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import CompanyForm, { type CompanySubmitData } from 'src/components/companies/CompanyForm';
import { useCompanyActions } from 'src/hooks/useCompanies';
import { ROUTES } from 'src/lib/constants/routes';
import type { Company } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{
		name: 'Entreprises',
		href: ROUTES.CompaniesPage(),
	},
	{ name: 'Modifier' },
];

type Props = {
	company: Company;
};

const CompanyPageView: FC<Props> = ({ company }) => {
	const companyActions = useCompanyActions();

	const handleSubmit = async (data: CompanySubmitData) => {
		await companyActions.update(company.id, data);
	};

	return (
		<Container maxWidth="xl">
			<Header
				title={company.name}
				icon={<Icons.company />}
				iconHref={ROUTES.CompaniesPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<CompanyForm
					mode="update"
					/* @ts-expect-error - data.company is a number. */
					defaultValues={company}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Container>
	);
};

export default CompanyPageView;
