import type { FC } from 'react';
import { Avatar, Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import { USER_ROLES_MAP } from 'src/constants/user';
import type { User } from 'src/types';

type Props = {
	data: User;
};

const UserAvatarManager: FC<Props> = ({ data: user }) => {
	return (
		<Card>
			<CardContent>
				<Box display="flex" alignItems="center" flexDirection="column" textAlign="center">
					<Avatar
						sx={{ height: 100, width: 100 }}
						// src={user.avatar}
					>
						<Icons.user size={52} />
					</Avatar>
					<Typography mt={1} color="textPrimary" gutterBottom variant="h5" marginTop={3}>
						{user.firstName} {user.lastName}
					</Typography>
					<Typography color="textPrimary" variant="body1">
						{USER_ROLES_MAP[user.role].title}
					</Typography>
				</Box>
			</CardContent>
			<CardActions>
				<Button fullWidth variant="text">
					Enlever l'image
				</Button>
			</CardActions>
		</Card>
	);
};

export default UserAvatarManager;
