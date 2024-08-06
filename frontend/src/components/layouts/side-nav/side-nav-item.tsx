import type { ComponentType, FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge, ListItemButton, ListItemIcon, ListItemText, SvgIcon } from '@mui/material';

type Props = {
	href: string;
	Icon?: ComponentType;
	title: string;
	target?: HTMLAttributeAnchorTarget;
	badge?: ReactNode;
};

const SideNavItem: FC<Props> = ({ href, Icon, title, target, badge }) => {
	const pathname = usePathname();
	const selected = pathname.startsWith(href);

	return (
		<ListItemButton
			key={title}
			selected={selected}
			target={target}
			href={href}
			LinkComponent={Link}
			disableGutters
			sx={{
				justifyContent: 'flex-start',
				px: 1.5,
				py: 1.25,
				textTransform: 'none',
				borderRadius: 1,
				width: '100%',
				color: (theme) => theme.palette.neutral[400],
				'&.Mui-selected': {
					color: (theme) => theme.palette.neutral[50],
					backgroundColor: (theme) => theme.palette.primary.alpha12,
					'& .MuiListItemIcon-root': {
						color: (theme) => theme.palette.primary.main,
					},
				},
			}}
		>
			{Icon && (
				<ListItemIcon sx={{ fontSize: 20 }}>
					{badge ? (
						<Badge>
							<SvgIcon fontSize="small">
								<Icon />
							</SvgIcon>
						</Badge>
					) : (
						<SvgIcon fontSize="small">
							<Icon />
						</SvgIcon>
					)}
				</ListItemIcon>
			)}
			<ListItemText
				primary={title}
				primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
			/>
		</ListItemButton>
	);
};

export default SideNavItem;
