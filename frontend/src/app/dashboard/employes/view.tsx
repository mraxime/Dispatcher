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
	employees: User[];
	params: UserParams;
	sx?: SxProps;
};

const EmployeesPageView: FC<Props> = ({ employees, params, sx }) => {
	const router = useRouter();
	const userActions = useUserActions();

	return (
		<Box sx={sx}>
			<UsersTable
				data={employees}
				params={params}
				onRefresh={userActions.revalidate}
				onParamsChange={userActions.setParams}
				onEdit={(id) => router.push(ROUTES.EmployeePage(id))}
				onDelete={userActions.delete}
			/>
		</Box>
	);
};

export default EmployeesPageView;
