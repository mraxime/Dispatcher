'use client';

import { useCallback, useEffect, useState, type FC, type ReactNode } from 'react';
import { Box, Stack, useMediaQuery } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

import SideNav, { DRAWER_WIDTH } from 'src/components/layouts/side-nav';
import TopNav from 'src/components/layouts/top-nav';
import { SessionProvider } from 'src/contexts/session-context';
import type { User } from 'src/lib/types/directus';

/**
 * Custom `main` element to fit correctly with the side-nav open/closure transition.
 */
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	position: 'relative',
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
	user: User;
	children?: ReactNode;
};

const DashboardLayout: FC<Props> = ({ children }) => {
	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
	const [isSideNavOpen, setSideNavOpen] = useState(false);

	useEffect(() => {
		setSideNavOpen(isDesktop);
	}, [isDesktop]);

	const toggleSideNav = useCallback(() => {
		setSideNavOpen((current) => !current);
	}, []);

	const closeSideNav = useCallback(() => {
		setSideNavOpen(false);
	}, []);

	return (
		<SessionProvider>
			<Stack flexDirection="row">
				<SideNav
					isOpen={isSideNavOpen}
					companies={/*FIXME*/ []}
					flexShrink={0}
					onClose={closeSideNav}
				/>
				<Main open={isSideNavOpen}>
					<TopNav onMenuClick={toggleSideNav} />
					<Box py={8}>{children}</Box>
				</Main>
			</Stack>
		</SessionProvider>
	);
};

export default DashboardLayout;
