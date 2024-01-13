'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Box, Button, Container, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import CompaniesTable from 'src/components/companies/CompaniesTable';
import { useCompanyActions } from 'src/hooks/useCompanies';
import { ROUTES } from 'src/lib/constants/routes';
import type { Company, CompanyParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Entreprises' },
];

type Props = {
	companies: Company[];
	params: CompanyParams;
};

const CompaniesPageView: FC<Props> = ({ companies, params }) => {
	const actions = useCompanyActions();

	return (
		<Container maxWidth="xl">
			<Header
				title="Liste des entreprises"
				icon={<Icons.company />}
				breadcrumbItems={breadcrumbs}
				actionElement={
					<Button
						href={ROUTES.NewCompanyPage()}
						LinkComponent={Link}
						variant="contained"
						startIcon={
							<SvgIcon fontSize="small">
								<Icons.add />
							</SvgIcon>
						}
					>
						Ajouter
					</Button>
				}
			/>

			<Box mt={4}>
				<CompaniesTable
					data={companies}
					params={params}
					onDelete={actions.delete}
					onRefresh={actions.revalidate}
					onParamsChange={actions.setParams}
				/>
			</Box>
		</Container>
	);
};

export default CompaniesPageView;
