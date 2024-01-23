'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import Cookies from 'js-cookie';

import UserForm, { type UserSubmitData } from 'src/components/users/UserForm';
import { useUserActions } from 'src/hooks/useUsers';
import { ROUTES } from 'src/lib/constants/routes';
import type { Company, Permission, Role } from 'src/lib/types/directus';

type Props = {
	companies: Company[];
	roles: Role[];
	permissions: Permission[];
	sx?: SxProps;
};

const NewUserPageView: FC<Props> = ({ companies, roles, permissions, sx }) => {
	const router = useRouter();
	const userActions = useUserActions();
	const companyCookie = Cookies.get('company');

	const handleSubmit = async (data: UserSubmitData) => {
		await userActions.create(data);
		router.push(ROUTES.UsersPage());
	};

	return (
		<Box sx={sx}>
			<UserForm
				mode="create"
				defaultValues={{ company: Number(companyCookie) }}
				companies={companies}
				roles={roles}
				permissions={permissions}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default NewUserPageView;
