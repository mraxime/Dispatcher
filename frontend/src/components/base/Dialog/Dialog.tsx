import {
	Avatar,
	Box,
	Button,
	Container,
	Modal,
	Paper,
	Stack,
	SvgIcon,
	Typography,
} from '@mui/material';

import { Icons } from 'src/components/base/Icons';

const Dialog = () => {
	return (
		<Modal open sx={{ display: 'grid', justifyItems: 'center' }}>
			<Container maxWidth="sm">
				<Paper elevation={12}>
					<Stack
						direction="row"
						spacing={2}
						sx={{
							display: 'flex',
							p: 3,
						}}
					>
						<Avatar
							sx={{
								backgroundColor: 'error.lightest',
								color: 'error.main',
							}}
						>
							<SvgIcon>
								<Icons.delete />
							</SvgIcon>
						</Avatar>
						<div>
							<Typography variant="h5">Supprimer cette entreprise ?</Typography>
							<Typography
								color="text.secondary"
								sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
								variant="body2"
							>
								Êtes-vous sûr de vouloir supprimer cette entreprise ?<br />
								Les données seront supprimées de manière permanente.
							</Typography>
						</div>
					</Stack>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							pb: 3,
							px: 3,
						}}
					>
						<Button color="inherit" sx={{ mr: 2 }}>
							Annuler
						</Button>
						<Button
							sx={{
								backgroundColor: 'error.main',
								'&:hover': {
									backgroundColor: 'error.dark',
								},
							}}
							variant="contained"
						>
							Supprimer
						</Button>
					</Box>
				</Paper>
			</Container>
		</Modal>
	);
};

export default Dialog;
