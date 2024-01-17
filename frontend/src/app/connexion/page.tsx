'use client';

import type { NextPage } from 'next';
import { Container } from '@mui/material';
import toast from 'react-hot-toast';

import UserLoginForm, { type UserLoginSubmitData } from 'src/components/users/UserLoginForm';
import { useSessionActions } from 'src/hooks/useSession';

const LoginPage: NextPage = () => {
	const session = useSessionActions();

	const handleSubmit = async (values: UserLoginSubmitData) => {
		try {
			await session.login(values.email, values.password);
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
