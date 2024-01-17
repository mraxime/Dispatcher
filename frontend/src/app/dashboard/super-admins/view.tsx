'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import UsersTable from 'src/components/users/UsersTable';
import { useUserActions } from 'src/hooks/useUsers';
import { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import { ROUTES } from 'src/lib/constants/routes';
import type { User, UserParams } from 'src/lib/types/directus';

type Props = {
	superAdmins: User[];
	params: UserParams;
	sx?: SxProps;
};

const SuperAdminsPageView: FC<Props> = ({ superAdmins, params, sx }) => {
	const router = useRouter();
	const userActions = useUserActions();

	return (
		<Box sx={sx}>
			<UsersTable
				data={superAdmins}
				params={params}
				basePath={ROUTES.SuperAdminsPage()}
				tabs={SUPER_USER_ROLES}
				onRefresh={userActions.revalidate}
				onParamsChange={userActions.setParams}
				onEdit={(id) => router.push(ROUTES.SuperAdminPage(id))}
				onDelete={userActions.delete}
			/>
		</Box>
	);
};

export default SuperAdminsPageView;
