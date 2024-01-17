'use client';

import type { FC } from 'react';
import type { SxProps } from '@mui/material/styles';

import UserAccountManager from 'src/components/users/UserAccountManager';
import type { UserProfileSubmitData } from 'src/components/users/UserProfileForm';
import { useSessionActions } from 'src/hooks/useSession';
import type { User } from 'src/lib/types/directus';

type Props = {
	session: User;
	sx?: SxProps;
};

const ProfilePageView: FC<Props> = ({ session, sx }) => {
	const sessionActions = useSessionActions();

	const handleSubmit = async (data: UserProfileSubmitData) => {
		await sessionActions.update(data);
	};

	return <UserAccountManager sx={sx} data={session} onSubmit={handleSubmit} />;
};

export default ProfilePageView;
