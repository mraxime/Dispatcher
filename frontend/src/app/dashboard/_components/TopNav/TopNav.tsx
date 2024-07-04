'use client';

import type { FC } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import { Icons } from 'src/components/base/Icons';
import type { User } from 'src/types';
import AccountButton from './AccountButton/AccountButton';
import NotificationsButton from './NotificationsButton/NotificationsButton';
import SettingsButton from './SettingsButton/SettingsButton';

const TOP_NAV_HEIGHT = 64;

type Props = {
	user: User;
	onMenuClick?: () => void;
};

const TopNav: FC<Props> = ({ user, onMenuClick }) => {
	return (
		<Box
			component="header"
			sx={{
				backdropFilter: 'blur(6px)',
				backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
				position: 'sticky',
				top: 0,
				left: 0,
				right: 0,
				zIndex: (theme) => theme.zIndex.appBar,
			}}
		>
			<Stack
				alignItems="center"
				direction="row"
				justifyContent="space-between"
				spacing={2}
				sx={{
					minHeight: TOP_NAV_HEIGHT,
					px: 2,
				}}
			>
				<Stack alignItems="center" direction="row" spacing={2}>
					<IconButton onClick={onMenuClick}>
						<SvgIcon>
							<Icons.menu />
						</SvgIcon>
					</IconButton>
				</Stack>
				<Stack alignItems="center" direction="row" spacing={2}>
					<NotificationsButton />
					<SettingsButton measureType={user.measureType} themeMode={user.theme} />
					<AccountButton user={user} />
				</Stack>
			</Stack>
		</Box>
	);
};

export default TopNav;
