import { companyParamsSchema } from 'src/lib/schemas/company.schema';
import type { CompanyParams } from 'src/lib/types/directus';
import { getCompanies } from 'src/server/actions/company.action';
import CompaniesPageView from './view';

const CompaniesPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
	const params: CompanyParams = {
		...companyParamsSchema.parseSearchParams(searchParams),
		fields: ['*', { admin: ['*'] }],
	};

	const companies = await getCompanies(params);

	return <CompaniesPageView companies={companies} params={params} />;
};

export default CompaniesPage;
