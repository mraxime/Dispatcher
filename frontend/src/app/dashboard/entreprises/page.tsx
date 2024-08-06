'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, SvgIcon } from '@mui/material';

import Header, { type BreadcrumbItem } from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import CompaniesTable from 'src/components/companies/CompaniesTable';
import { useCompanies } from 'src/hooks/useCompanies';
import { ROUTES } from 'src/lib/constants/routes';
import type { CompanyParams } from 'src/lib/types/directus';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Entreprises' },
];

const CompaniesPage = () => {
	const params: CompanyParams = {
		page: 1,
		limit: 10,
		fields: ['*', { admin: ['*'] }],
		filter: { active: { _eq: true } },
		sort: '-date_created',
	};

	const companies = useCompanies(params);
	const router = useRouter();

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
					data={companies.data}
					params={companies.params}
					isLoading={companies.isLoading}
					onRefresh={companies.revalidate}
					onParamsChange={companies.setParams}
					onEdit={(id) => router.push(ROUTES.CompanyPage(id))}
					onDelete={companies.delete}
				/>
			</Box>
		</Container>
	);
};

export default CompaniesPage;
