import type { FC } from 'react';
import { List, ListSubheader, Stack, Typography } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import { type NavMenu } from 'src/lib/constants/navigation';
import SideNavItem from './side-nav-item';

type Props = {
	menu: NavMenu;
	sx?: SxProps;
};

const SideNavMenu: FC<Props> = ({ menu, sx }) => {
	return (
		<Stack spacing={2} sx={sx}>
			{Object.entries(menu).map(([group, navItems]) => {
				if (navItems.every((item) => item.hidden === true)) return null;
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
								if (navItem.hidden === true) return null;
								return (
									<SideNavItem
										key={group + navItem.title}
										title={navItem.title}
										Icon={navItem.Icon}
										href={navItem.disabled ? undefined : navItem.href}
										target={navItem.isExternalHref ? '_blank' : undefined}
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
