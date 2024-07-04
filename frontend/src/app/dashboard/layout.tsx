import { type FC, type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import ForceClient from 'src/components/base/ForceClient';
import { ROUTES } from 'src/constants/routes';
import { SocketProvider } from 'src/providers/SocketProvider';
import { getCompanies, getMyPermissionKeys, getSession } from 'src/server/services';
import DashboardView from './_components/DashboardView';

type Props = {
	children?: ReactNode;
};

const DashboardLayout: FC<Props> = async ({ children }) => {
	const session = await getSession();
	if (!session.user) throw redirect(ROUTES.LoginPage());

	const [permissionKeys, companies] = await Promise.all([getMyPermissionKeys(), getCompanies()]);

	return (
		<ForceClient>
			<DashboardView user={session.user} permissionKeys={permissionKeys} companies={companies}>
				<SocketProvider user={session.user}>{children}</SocketProvider>
			</DashboardView>
		</ForceClient>
	);
};

export default DashboardLayout;
