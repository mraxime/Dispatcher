import Link from 'next/link';
import { Box, Button, Container, SvgIcon } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import CompaniesTable from 'src/components/company/CompaniesTable';
import { ROUTES } from 'src/constants/routes';
import { getCompanies } from 'src/server/services';
import { companyParamsSchema } from 'src/validations/company';
import { pageGuard } from '../guard';

const CompaniesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const session = await pageGuard('companies:read');

	const params = companyParamsSchema.parse(searchParams);
	const companies = await getCompanies(params);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{ name: 'Entreprises' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={`Mes entreprises`}
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
				<CompaniesTable data={companies} params={params} />
			</Box>
		</Container>
	);
};

export default CompaniesPage;
