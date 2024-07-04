import type { FC } from 'react';
import { Avatar } from '@mui/material';
import type { User } from 'src/types';
import { getInitials } from 'src/utils';

type Props = {
	data: User;
};

const UserAvatar: FC<Props> = ({ data: user }) => {
	return (
		<Avatar alt={`Avatar de ${user.firstName}`}>
			{getInitials(`${user.firstName} ${user.lastName}`)}
		</Avatar>
	);
};

export default UserAvatar;
