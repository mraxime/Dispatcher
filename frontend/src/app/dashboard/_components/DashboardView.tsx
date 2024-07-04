'use client';

import { useEffect, type FC, type ReactNode } from 'react';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';
import type { PermissionKey } from 'src/constants/user';
import useDisclosure from 'src/hooks/useDisclosure';
import type { Company, User } from 'src/types';
import SideNav, { DRAWER_WIDTH } from './SideNav';
import TopNav from './TopNav';

/**
 * Custom `main` element to fit correctly with the side-nav open/closure transition.
 */
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
	[theme.breakpoints.up('lg')]: {
		marginLeft: open ? 0 : `-${DRAWER_WIDTH}`,
	},
}));

type Props = {
	children?: ReactNode;
	user: User;
	permissionKeys: PermissionKey[];
	companies: Company[];
};

const DashboardLayoutView: FC<Props> = ({ children, user, permissionKeys, companies }) => {
	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
	const sideNavDisclosure = useDisclosure(isDesktop ? true : false);

	useEffect(() => {
		if (isDesktop) sideNavDisclosure.open();
		else sideNavDisclosure.close();
	}, [isDesktop]);

	return (
		<Stack flexDirection="row" minHeight="100svh">
			<SideNav
				isOpen={sideNavDisclosure.isOpen}
				user={user}
				companies={companies}
				permissionKeys={permissionKeys}
				flexShrink={0}
				onClose={sideNavDisclosure.close}
			/>
			<Main open={sideNavDisclosure.isOpen}>
				<TopNav user={user} onMenuClick={sideNavDisclosure.toggle} />
				<Box py={8} flexGrow={1}>
					{children}
				</Box>
				{/* <Box textAlign="center" mb={0.5}> */}
				{/* 	<Typography variant="caption" color="neutral.500"> */}
				{/* 		rq &copy; {new Date().getFullYear()}. */}
				{/* 	</Typography> */}
				{/* </Box> */}
			</Main>
		</Stack>
	);
};

export default DashboardLayoutView;
