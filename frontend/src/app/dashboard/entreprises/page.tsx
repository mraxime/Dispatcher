import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { companyParamsSchema } from 'src/lib/schemas/company.schema';
import type { CompanyParams } from 'src/lib/types/directus';
import { deepMerge } from 'src/lib/utils';
import { getCompanies } from 'src/server/actions/company.action';
import CompaniesPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Entreprises' },
];

const CompaniesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params = deepMerge<CompanyParams>(companyParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*', { admin: ['*'] }],
		sort: '-date_created',
	});

	const companies = await getCompanies(params);

	return (
		<Container maxWidth="xl">
			<PageHeader
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
			<CompaniesPageView sx={{ mt: 4 }} companies={companies} params={params} />
		</Container>
	);
};

export default CompaniesPage;
