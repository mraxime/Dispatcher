import { type FC, type ReactNode } from 'react';

import { getCompanies } from 'src/server/actions/company.action';
import { getSession } from 'src/server/actions/user.action';
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
