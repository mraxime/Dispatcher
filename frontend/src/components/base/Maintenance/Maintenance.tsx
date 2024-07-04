import type { NextPage } from 'next';
import Image from 'next/image';
import { Box, Paper, Stack, Typography } from '@mui/material';

const Maintenance: NextPage = () => {
	const mobileDevice = true;

	return (
		<Paper sx={{ mt: 6, p: 4 }}>
			<Stack spacing={1}>
				<Typography align="center" variant={mobileDevice ? 'h4' : 'h1'} color="textPrimary">
					En développement
				</Typography>
				<Typography align="center" variant="subtitle2">
					Cette page sera accessible prochainement...
				</Typography>
				<Box display="flex" justifyContent="center">
					<Image
						alt="Under development"
						src="/static/development.svg"
						width={560}
						height={300}
						style={{
							maxWidth: '100%',
							height: 'auto',
						}}
					/>
				</Box>
			</Stack>
		</Paper>
	);
};

export default Maintenance;
