'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import Cookies from 'js-cookie';

import UserForm, { type UserSubmitData } from 'src/components/users/UserForm';
import { useUserActions } from 'src/hooks/useUsers';
import { ROUTES } from 'src/lib/constants/routes';
import type { Permission, Role } from 'src/lib/types/directus';

type Props = {
	roles: Role[];
	permissions: Permission[];
	sx?: SxProps;
};

const NewEmployeePageView: FC<Props> = ({ roles, permissions, sx }) => {
	const router = useRouter();
	const userActions = useUserActions();
	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: UserSubmitData) => {
		await userActions.create(data);
		router.push(ROUTES.EmployeesPage());
	};

	return (
		<Box sx={sx}>
			<UserForm
				mode="create"
				defaultValues={{ company: Number(companyCookie) }}
				roles={roles}
				permissions={permissions}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default NewEmployeePageView;
