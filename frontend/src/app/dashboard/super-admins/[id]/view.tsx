'use client';

import type { FC } from 'react';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import UserForm, { type UserSubmitData } from 'src/components/users/UserForm';
import { useUserActions } from 'src/hooks/useUsers';
import type { JunctionUserPermission, Permission, Role, User } from 'src/lib/types/directus';

type Props = {
	superAdmin: User;
	roles: Role[];
	permissions: Permission[];
	sx?: SxProps;
};

const SuperAdminPageView: FC<Props> = ({ superAdmin, roles, permissions, sx }) => {
	const userActions = useUserActions();

	const handleSubmit = async (data: UserSubmitData) => {
		await userActions.update(superAdmin.id, data);
	};

	// Get the actual permission ids from the junctions
	const superAdminPermissionIds = (superAdmin.permissions as JunctionUserPermission[]).map(
		({ custom_permissions_id }) => custom_permissions_id as number,
	);

	return (
		<Box sx={sx}>
			<UserForm
				mode="update"
				// @ts-expect-error - anoying typescript :)
				defaultValues={{ ...superAdmin, permissions: superAdminPermissionIds }}
				roles={roles}
				permissions={permissions}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default SuperAdminPageView;
