'use client';

import { useEffect, type FC, type ReactNode } from 'react';
import { Box, Stack, useMediaQuery } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

import SideNav, { DRAWER_WIDTH } from 'src/components/layouts/side-nav';
import TopNav from 'src/components/layouts/top-nav';
import useDisclosure from 'src/hooks/useDisclosure';
import type { Company, User } from 'src/lib/types/directus';

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
	children?: ReactNode;
	session: User;
	companies: Company[];
};

const DashboardLayoutView: FC<Props> = ({ children, session, companies }) => {
	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
	const sideNavDisclosure = useDisclosure(isDesktop ? true : false);

	useEffect(() => {
		if (isDesktop) sideNavDisclosure.open();
		else sideNavDisclosure.close();
	}, [isDesktop]);

	return (
		<Stack flexDirection="row">
			<SideNav
				isOpen={sideNavDisclosure.isOpen}
				session={session}
				companies={companies}
				flexShrink={0}
				onClose={sideNavDisclosure.close}
			/>
			<Main open={sideNavDisclosure.isOpen}>
				<TopNav session={session} onMenuClick={sideNavDisclosure.toggle} />
				<Box py={8}>{children}</Box>
			</Main>
		</Stack>
	);
};

export default DashboardLayoutView;
