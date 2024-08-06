import type { FC } from 'react';
import { Avatar } from '@mui/material';

import type { User } from 'src/lib/types/directus';
import { getInitials } from 'src/lib/utils';

type Props = {
	data: User;
};

const UserAvatar: FC<Props> = ({ data: user }) => {
	return (
		<Avatar alt={user.first_name ? `Avatar de ${user.first_name}` : undefined}>
			{user.first_name ? getInitials(`${user.first_name} ${user.last_name}`) : undefined}
		</Avatar>
	);
};

export default UserAvatar;
