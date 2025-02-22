import type { FC } from 'react';
import Link from 'next/link';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import { Icons } from 'src/components/base/Icons';
import { ROUTES } from 'src/constants/routes';
import { USER_ROLES_MAP } from 'src/constants/user';
import type { User } from 'src/types';

type Props = {
	user: User;
	sx?: SxProps;
};

const SideNavProfile: FC<Props> = ({ user, sx }) => {
	return (
		<Box sx={sx}>
			<Stack flexDirection="column" gap={2} alignItems="center" justifyContent="start" px={2}>
				<Avatar
					href={ROUTES.ProfilePage()}
					component={Link}
					alt="User"
					sx={{ width: 64, height: 64, bgcolor: 'neutral.50' }}
				>
					<Icons.user size={36} />
				</Avatar>
				<Stack alignItems="center">
					<Typography variant="h6" color="neutral.50">
						{`${user.firstName} ${user.lastName}`}
					</Typography>
					<Typography variant="subtitle2" color="neutral.400">
						{USER_ROLES_MAP[user.role].title}
					</Typography>
				</Stack>
			</Stack>
		</Box>
	);
};

export default SideNavProfile;
