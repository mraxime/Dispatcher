import { Container } from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import PageHeader from 'src/components/base/PageHeader';
import { getSession } from 'src/server/actions/auth.action';
import ProfilePageView from './view';

const ProfilePage = async () => {
	const session = await getSession();

	return (
		<Container maxWidth="xl">
			<PageHeader title="Mon profil" icon={<Icons.user />} />
			<ProfilePageView sx={{ mt: 4 }} session={session} />
		</Container>
	);
};

export default ProfilePage;
