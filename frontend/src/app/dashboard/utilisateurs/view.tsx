'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import UsersTable from 'src/components/users/UsersTable';
import { useUserActions } from 'src/hooks/useUsers';
import { ROUTES } from 'src/lib/constants/routes';
import type { User, UserParams } from 'src/lib/types/directus';

type Props = {
	users: User[];
	params: UserParams;
	sx?: SxProps;
};

const UsersPageView: FC<Props> = ({ users, params, sx }) => {
	const router = useRouter();
	const userActions = useUserActions();

	return (
		<Box sx={sx}>
			<UsersTable
				data={users}
				params={params}
				onRefresh={userActions.revalidate}
				onParamsChange={userActions.setParams}
				onEdit={(id) => router.push(ROUTES.UserPage(id))}
				onDelete={userActions.delete}
			/>
		</Box>
	);
};

export default UsersPageView;
