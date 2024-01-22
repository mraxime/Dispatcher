import { type FC, type ReactNode } from 'react';

import { getSession } from 'src/server/actions/auth.action';
import { getCompanies } from 'src/server/actions/company.action';
import DashboardLayoutView from './view';

type Props = {
	children?: ReactNode;
};

const DashboardLayout: FC<Props> = async ({ children }) => {
	const [session, companies] = await Promise.all([getSession(), getCompanies()]);

	return (
		<DashboardLayoutView session={session} companies={companies}>
			{children}
		</DashboardLayoutView>
	);
};

export default DashboardLayout;
