'use client';

import { useCallback, type FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, Box, Divider, Drawer, Stack, Typography, useMediaQuery } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import toast from 'react-hot-toast';
import CompanyList from 'src/components/company/CompanyList';
import { NAV_MENU } from 'src/constants/navigation';
import { ROUTES } from 'src/constants/routes';
import type { PermissionKey } from 'src/constants/user';
import { setCompany } from 'src/server/actions/settings';
import type { Company, User } from 'src/types';
import SideNavMenu from './SideNavMenu';

type Props = {
	isOpen: boolean;
	user: User;
	companies: Company[];
	permissionKeys: PermissionKey[];
	onClose: () => void;
} & SxProps;

export const DRAWER_WIDTH = '275px';

const SideNav: FC<Props> = ({ isOpen, user, companies, permissionKeys, onClose, ...restProps }) => {
	const pathname = usePathname();
	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

	const handleItemClick = useCallback(() => {
		if (!isDesktop) onClose();
	}, [isDesktop, onClose]);

	const handleCompanySelect = async (company: Company) => {
		// skip if it's the current
		if (company.id === user.selectedCompanyId) return;
		const result = await setCompany(company.id, pathname);
		toast.success(`Entreprise "${company.name}" sélectionnée`);
		return result;
	};

	return (
		<Drawer
			open={isOpen}
			onClose={isDesktop ? undefined : onClose}
			variant={isDesktop ? 'persistent' : 'temporary'}
			sx={{
				flexBasis: DRAWER_WIDTH,
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
			{/* Logo Header */}
			<Box mt={2}>
				<Stack
					component={Link}
					href={ROUTES.ProfilePage()}
					direction="row"
					gap={1.5}
					alignItems="center"
					justifyContent="start"
					px={2}
					sx={{ textDecoration: 'none' }}
				>
					<Avatar
						alt="User"
						sx={{
							width: 48,
							height: 36,
							bgcolor: (theme) => theme.palette.primary.light,
							borderRadius: 1,
						}}
					>
						<Image
							priority
							quality={98}
							src="/static/logo.png"
							alt="rq logo"
							width={38}
							height={38}
							style={{
								objectFit: 'contain',
							}}
						/>
					</Avatar>
					<Stack>
						<Stack direction="row" gap={0.5} flexGrow={1}>
							<Typography variant="h6" color="primary.lightest">
								R
							</Typography>
							<Typography variant="subtitle2" color="primary.light">
								Q
							</Typography>
						</Stack>
						<Typography variant="caption" color="neutral.400">
							Remorquage simplifié
						</Typography>
					</Stack>
				</Stack>
			</Box>

			<Box mt={2.5}>
				<Divider sx={{ borderColor: 'neutral.700' }} />
			</Box>

			{/* Company Selector */}
			<Stack mt={3} px={2}>
				<Typography variant="overline" color="neutral.50">
					Sélection entreprise
				</Typography>
				<CompanyList
					sx={{
						maxHeight: 270,
						overflowY: 'auto',
						overflowX: 'hidden',
					}}
					data={companies}
					defaultValue={user.selectedCompanyId}
					onSelect={handleCompanySelect}
				/>
			</Stack>

			<Box mt={2.5}>
				<Divider sx={{ borderColor: 'neutral.700' }} />
			</Box>

			{/* Navigation Menu */}
			<Box flexGrow={1} mt={2.5} px={2}>
				<SideNavMenu
					menu={NAV_MENU}
					permissionKeys={permissionKeys}
					onItemClick={handleItemClick}
				/>
			</Box>
		</Drawer>
	);
};

export default SideNav;
