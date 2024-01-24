import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button, Container, SvgIcon } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import { ROUTES } from 'src/lib/constants/routes';
import { companyParamsSchema } from 'src/lib/schemas/company.schema';
import type { CompanyParams } from 'src/lib/types/directus';
import { deepMerge } from 'src/lib/utils';
import { getCompanies, getCompany } from 'src/server/actions/company.action';
import CompaniesPageView from './view';

const breadcrumbs: BreadcrumbItem[] = [
	{
		name: 'Dashboard',
		href: ROUTES.DashboardPage(),
	},
	{ name: 'Entreprises' },
];

const CompaniesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const companyCookie = cookies().get('company')?.value;
	const params = deepMerge<CompanyParams>(companyParamsSchema.parseSearchParams(searchParams), {
		page: 1,
		limit: 10,
		fields: ['*', { admin: ['*'] }],
		filter: { parent_company: { _eq: companyCookie } },
		sort: '-date_created',
	});

	const [companies, currentCompany] = await Promise.all([
		getCompanies(params),
		getCompany(Number(companyCookie)),
	]);

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={`Entreprises (${currentCompany.name})`}
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
