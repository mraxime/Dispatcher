'use client';

import type { FC, ReactElement, ReactNode } from 'react';
import Link from 'next/link';
import {
	Box,
	Breadcrumbs,
	IconButton,
	Link as MuiLink,
	Stack,
	SvgIcon,
	Typography,
	useMediaQuery,
	type BoxProps,
} from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';

import BreadcrumbsSeparator from 'src/components/base/BreadcrumbsSeparator';
import { Icons } from 'src/components/base/Icons';
import type { BreadcrumbItem } from './types';

// temporary
const disableIcon = false;

type Props = {
	title: string;
	actionElement?: ReactElement;
	icon?: ReactNode;
	iconHref?: string;
	breadcrumbItems?: BreadcrumbItem[];
	caption?: string;
} & BoxProps;

const PageHeader: FC<Props> = ({
	title,
	actionElement,
	icon,
	iconHref,
	breadcrumbItems,
	caption,
	...restProps
}) => {
	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	return (
		<Box {...restProps}>
			<Stack direction="row" alignItems="center" spacing={2}>
				{!disableIcon && isDesktop && iconHref && (
					<IconButton
						size="large"
						aria-label="retour"
						href={iconHref}
						LinkComponent={Link}
						sx={{
							alignSelf: 'start',
							color: 'primary.main',
							bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
							':hover': {
								bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
							},
						}}
					>
						<SvgIcon>{icon ?? <Icons.back />}</SvgIcon>
					</IconButton>
				)}
				{!disableIcon && isDesktop && icon && !iconHref && (
					<IconButton
						size="large"
						disabled
						sx={{
							alignSelf: 'start',
							':hover': {
								bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
							},
							':disabled': {
								color: (theme) => alpha(theme.palette.primary.main, 1),
								bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
							},
						}}
					>
						<SvgIcon>{icon}</SvgIcon>
					</IconButton>
				)}
				<Stack flexGrow={1} position="relative" spacing={0.5}>
					{caption && (
						<Typography position="absolute" top={-12} color="textSecondary" variant="caption">
							{caption}
						</Typography>
					)}
					<Typography component="h1" variant="h4" color="textPrimary">
						{title}
					</Typography>
					{breadcrumbItems && (
						<Breadcrumbs sx={{ pl: 0.5 }} separator={<BreadcrumbsSeparator />}>
							{breadcrumbItems.map((item) =>
								item.href ? (
									<MuiLink
										key={item.name}
										color="text.primary"
										variant="subtitle2"
										component={Link}
										href={item.href}
									>
										{item.name}
									</MuiLink>
								) : (
									<Typography key={item.name} color="text.secondary" variant="subtitle2">
										{item.name}
									</Typography>
								),
							)}
						</Breadcrumbs>
					)}
				</Stack>
				{actionElement && <div>{actionElement}</div>}
			</Stack>
		</Box>
	);
};

export default PageHeader;
