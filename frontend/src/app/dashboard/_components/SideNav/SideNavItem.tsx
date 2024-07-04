import type { ComponentType, FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListItemButton, ListItemIcon, ListItemText, SvgIcon } from '@mui/material';

type Props = {
	href: string;
	Icon?: ComponentType;
	title: string;
	target?: HTMLAttributeAnchorTarget;
	badge?: ReactNode;
	onClick?: () => void;
};

const SideNavItem: FC<Props> = ({ href, Icon, title, target, onClick }) => {
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
				textTransform: 'none',
				color: (theme) => theme.palette.neutral[400],
				'&.Mui-selected': {
					color: (theme) => theme.palette.neutral[50],
					backgroundColor: (theme) => theme.palette.primary.alpha12,
					'& .MuiListItemIcon-root': {
						color: (theme) => theme.palette.primary.main,
					},
				},
			}}
			onClick={onClick}
		>
			{Icon && (
				<ListItemIcon sx={{ fontSize: 20 }}>
					<SvgIcon fontSize="small">
						<Icon />
					</SvgIcon>
				</ListItemIcon>
			)}
			<ListItemText primary={title} primaryTypographyProps={{ variant: 'body2' }} />
		</ListItemButton>
	);
};

export default SideNavItem;
