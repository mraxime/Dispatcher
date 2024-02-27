'use client';

import { useCallback, type FC } from 'react';
import { usePathname } from 'next/navigation';
import { Box, Drawer, Stack, Typography, useMediaQuery } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Cookies from 'js-cookie';

import CompanySelectInput from 'src/components/companies/CompanySelectInput';
import { NAV_MENU } from 'src/lib/constants/navigation';
import type { Company, JunctionUserPermission, Permission, User } from 'src/lib/types/directus';
import { setCompany } from 'src/server/actions/setting.action';
import SideNavMenu from './side-nav-menu';
import SideNavProfile from './side-nav-profile';

type Props = {
	isOpen: boolean;
	session: User;
	companies: Company[];
	onClose: () => void;
} & SxProps;

export const DRAWER_WIDTH = '275px';

const SideNav: FC<Props> = ({ isOpen, session, companies, onClose, ...restProps }) => {
	const pathname = usePathname();
	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
	const companyId = Cookies.get('company');

	// Retreive real permissions from junction data
	const permissions = (session.permissions as JunctionUserPermission[]).map(
		(value) => value.custom_permissions_id as Permission,
	);

	const handleItemClick = useCallback(() => {
		if (!isDesktop) onClose();
	}, [isDesktop, onClose]);

	return (
		<Drawer
			open={isOpen}
			onClose={isDesktop ? undefined : onClose}
			variant={isDesktop ? 'persistent' : 'temporary'}
			sx={{
				width: DRAWER_WIDTH,
				display: 'flex',
				flexDirection: 'column',
				zIndex: (theme) => (isDesktop ? theme.zIndex.appBar - 1 : theme.zIndex.appBar + 1),
				...restProps,
			}}
			PaperProps={{
				elevation: 3,
				sx: {
					width: DRAWER_WIDTH,
					border: 'none',
					bgcolor: (theme) => theme.palette.neutral[800],
				},
			}}
		>
			<SideNavProfile user={session} sx={{ mt: 5 }} />

			<Stack mt={3} py={1} px={2} flexGrow={1}>
				<CompanySelectInput
					sx={{ width: '100%', my: 3 }}
					InputLabelProps={{
						sx: {
							color: (theme) => theme.palette.neutral[400],
						},
					}}
					InputProps={{
						sx: {
							color: (theme) => theme.palette.neutral[50],
							borderColor: (theme) => theme.palette.neutral[600],
						},
					}}
					items={companies}
					defaultValue={Number(companyId)}
					onSelect={(company) => setCompany(company.id, pathname)}
				/>

				<Box flexGrow={1}>
					{Boolean(companyId) && (
						<SideNavMenu menu={NAV_MENU(permissions)} onItemClick={handleItemClick} />
					)}
				</Box>

				<Box textAlign="center" mt={3}>
					<Typography variant="caption" color="neutral.500">
						{new Date().getFullYear()} &copy; Répartition Québec
					</Typography>
				</Box>
			</Stack>
		</Drawer>
	);
};

export default SideNav;
