import type { NextPage } from 'next';
import { redirect } from 'next/navigation';
import { Container } from '@mui/material';
import UserLoginForm from 'src/components/user/UserLoginForm';
import { ROUTES } from 'src/constants/routes';
import { getSession } from 'src/server/services';

const LoginPage: NextPage = async () => {
	const { user } = await getSession();
	if (user) throw redirect(ROUTES.DashboardPage());

	return (
		<Container
			sx={{
				minHeight: '100svh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<UserLoginForm />
		</Container>
	);
};

export default LoginPage;
