import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import { ROUTES } from 'src/constants/routes';

const NotFoundPage: NextPage = () => {
	const mobileDevice = true;

	return (
		<Container
			maxWidth="lg"
			sx={{
				minHeight: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				px: 3,
				py: 20,
			}}
		>
			<Typography align="center" variant={mobileDevice ? 'h4' : 'h1'} color="textPrimary">
				404: Non trouvable
			</Typography>
			<Typography align="center" variant="subtitle2">
				Cette page que vous souhaitez accéder n'existe pas.
			</Typography>
			<Box mt={6} display="flex" justifyContent="center">
				<Image
					alt="Under development"
					src="/static/404.svg"
					width={560}
					height={300}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
			</Box>
			<Box mt={6} display="flex" justifyContent="center">
				<Button href={ROUTES.DashboardPage()} LinkComponent={Link} variant="outlined">
					Retour à l'accueil
				</Button>
			</Box>
		</Container>
	);
};

export default NotFoundPage;
