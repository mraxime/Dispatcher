'use client';

import { Container } from '@mui/material';

import Header from 'src/components/base/Header';
import { Icons } from 'src/components/base/Icons';
import UserAccountManager from 'src/components/users/UserAccountManager';
import type { UserProfileSubmitData } from 'src/components/users/UserProfileForm';
import { useSession } from 'src/contexts/session-context';

const ProfilePage = () => {
	const session = useSession();

	const handleSubmit = async (data: UserProfileSubmitData) => {
		await session.update(data);
	};

	return (
		<Container maxWidth="xl">
			<Header title="Mon profil" icon={<Icons.user />} />
			<UserAccountManager sx={{ mt: 4 }} data={session.data} onSubmit={handleSubmit} />
		</Container>
	);
};

export default ProfilePage;
