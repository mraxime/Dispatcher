'use client';

import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { Container } from '@mui/material';
import toast from 'react-hot-toast';

import UserLoginForm, { type UserLoginSubmitData } from 'src/components/users/UserLoginForm';
import { useOptionalSession } from 'src/hooks/useSession';
import { ROUTES } from 'src/lib/constants/routes';

const LoginPage: NextPage = () => {
	const session = useOptionalSession();
	const router = useRouter();

	const handleSubmit = async (values: UserLoginSubmitData) => {
		try {
			await session.login(values.email, values.password);
			router.replace(ROUTES.ProfilePage());
		} catch {
			toast.error('Identifiant ou mot de passe incorrectes');
		}
	};

	return (
		<Container
			sx={{
				minHeight: '100svh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<UserLoginForm onSubmit={handleSubmit} />
		</Container>
	);
};

export default LoginPage;
