import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import TowingForm from 'src/components/towing/TowingForm';
import { ROUTES } from 'src/constants/routes';
import { getCompanies } from 'src/server/services';
import { pageGuard } from '../../guard';

const NewTowingPage = async () => {
	const session = await pageGuard('towings:read', 'towings:create');
	const companies = await getCompanies();

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Remorques',
			href: ROUTES.TowingsPage(),
		},
		{ name: 'Ajouter' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Créer une remorque"
				icon={<Icons.towing />}
				iconHref={ROUTES.TowingsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<TowingForm
					companies={companies}
					defaultValues={{ companyId: session.user.selectedCompanyId }}
				/>
			</Box>
		</Container>
	);
};

export default NewTowingPage;
