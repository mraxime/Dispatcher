import { Box, Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader, { type BreadcrumbItem } from 'src/components/base/PageHeader';
import TowingForm from 'src/components/towing/TowingForm';
import { ROUTES } from 'src/constants/routes';
import { getCompanies, getTowing } from 'src/server/services';
import { pageGuard } from '../../guard';

const TowingPage = async ({ params }: { params: { id: string } }) => {
	const session = await pageGuard('towings:read');
	const [towing, companies] = await Promise.all([getTowing(params.id), getCompanies()]);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: session.selectedCompany.name,
			href: ROUTES.DashboardPage(),
		},
		{
			name: 'Remorques',
			href: ROUTES.TowingsPage(),
		},
		{ name: 'Modifier' },
	];

	return (
		<Container maxWidth="xl">
			<PageHeader
				title={towing.name}
				icon={<Icons.towing />}
				iconHref={ROUTES.TowingsPage()}
				breadcrumbItems={breadcrumbs}
			/>

			<Box mt={4}>
				<TowingForm id={towing.id} companies={companies} defaultValues={towing} />
			</Box>
		</Container>
	);
};

export default TowingPage;
