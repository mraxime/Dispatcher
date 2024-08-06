'use client';

import { type FC } from 'react';
import { usePathname } from 'next/navigation';
import { Box, Divider, Drawer, Stack, Typography, useMediaQuery } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Cookies from 'js-cookie';

import CompanySearchInput from 'src/components/companies/CompanySearchInput';
import { useSession } from 'src/contexts/session-context';
import { useCompanies } from 'src/hooks/useCompanies';
import { NAV_MENU, NAV_MENU_ADMIN } from 'src/lib/constants/navigation';
import type { CustomPermission, JunctionUserCustomPermission } from 'src/lib/types/directus';
import { isObject } from 'src/lib/utils';
import { setCompany } from 'src/server/actions/settings';
import SideNavMenu from './side-nav-menu';
import SideNavProfile from './side-nav-profile';

type Props = {
	isOpen: boolean;
	onClose: () => void;
} & SxProps;

export const DRAWER_WIDTH = '275px';

const SideNav: FC<Props> = ({ isOpen, onClose, ...restProps }) => {
	const pathname = usePathname();
	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
	const session = useSession();
	const companies = useCompanies();
	const companyId = Cookies.get('company');

	// Retreive real permissions from junction data
	const permissions = (session.data.permissions as JunctionUserCustomPermission[]).map(
		(value) => value.custom_permissions_id as CustomPermission,
	);

	const isSuperAdmin = isObject(session.data.role) && session.data.role.name === 'Super Admin';

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
			<SideNavProfile user={session.data} sx={{ mt: 5 }} />

			<Stack mt={3} py={1} px={2} flexGrow={1}>
				{isSuperAdmin && (
					<>
						<SideNavMenu menu={NAV_MENU_ADMIN} />
						<Box my={2}>
							<Divider
								sx={{ bgcolor: (theme) => theme.palette.neutral[600] }}
								style={{ border: 'none', height: 1, margin: 0 }}
							/>
						</Box>
						<CompanySearchInput
							sx={{ width: '100%', my: 3 }}
							items={companies.data}
							current={Number(companyId) || null}
							onSelect={(company) => setCompany(company?.id ?? null, pathname)}
						/>
					</>
				)}

				<Box flexGrow={1}>{Boolean(companyId) && <SideNavMenu menu={NAV_MENU(permissions)} />}</Box>

				<Box my={2}>
					<Divider
						sx={{ bgcolor: (theme) => theme.palette.neutral[600] }}
						style={{ border: 'none', height: 1, margin: 0 }}
					/>
				</Box>

				<Box p={2}>
					<Typography variant="caption" color="neutral.50">
						&copy; Répartition Quebec
					</Typography>
				</Box>
			</Stack>
		</Drawer>
	);
};

export default SideNav;
