import { useMemo, type FC } from 'react';
import { List, ListSubheader, Stack, Typography } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import type { NavItem, NavMenu } from 'src/constants/navigation';
import type { PermissionKey } from 'src/constants/user';
import SideNavItem from './SideNavItem';

type Props = {
	menu: NavMenu;
	permissionKeys: PermissionKey[];
	sx?: SxProps;
	onItemClick?: (item: NavItem) => void;
};

const SideNavMenu: FC<Props> = ({ menu, permissionKeys, sx, onItemClick }) => {
	// new set to reduce iterations
	const permissionKeysSet = useMemo(() => new Set(permissionKeys), [permissionKeys]);

	return (
		<Stack spacing={2} sx={sx}>
			{Object.entries(menu).map(([group, navItems]) => {
				if (
					navItems.every(
						(navItem) =>
							navItem.hidden === true ||
							(navItem.permission && !permissionKeysSet.has(navItem.permission)),
					)
				)
					return null;
				return (
					<List
						key={group}
						subheader={
							<ListSubheader disableGutters disableSticky>
								<Typography variant="overline" color="neutral.50">
									{group}
								</Typography>
							</ListSubheader>
						}
					>
						<List disablePadding>
							{navItems.map((navItem) => {
								if (
									navItem.hidden === true ||
									(navItem.permission && !permissionKeysSet.has(navItem.permission))
								)
									return null;
								return (
									<SideNavItem
										key={group + navItem.title}
										title={navItem.title}
										Icon={navItem.Icon}
										href={navItem.href}
										target={navItem.isExternalHref ? '_blank' : undefined}
										onClick={() => onItemClick?.(navItem)}
									/>
								);
							})}
						</List>
					</List>
				);
			})}
		</Stack>
	);
};

export default SideNavMenu;
