import { getCompany } from 'src/server/actions/company.action';
import CompanyPageView from './view';

const CompanyPage = async ({ params }: { params: { id: number } }) => {
	const company = await getCompany(params.id, { fields: ['*', { admin: ['*'] }] });

	return <CompanyPageView company={company} />;
};

export default CompanyPage;
