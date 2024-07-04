import { Container } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import PageHeader from 'src/components/base/PageHeader';
import UserAccountManager from 'src/components/user/UserAccountManager';
import { pageGuard } from '../guard';

const ProfilePage = async () => {
	const session = await pageGuard();

	return (
		<Container maxWidth="xl">
			<PageHeader title="Mon profil" icon={<Icons.user />} />
			<UserAccountManager sx={{ mt: 4 }} data={session.user} />
		</Container>
	);
};

export default ProfilePage;
