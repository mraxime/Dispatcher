import type { FC, ReactNode } from 'react';
import { Box, CircularProgress, IconButton, SvgIcon } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Icons } from 'src/components/base/Icons';

type Props = {
	isActive: boolean;
	variant?: 'load' | 'refresh';
	onRefresh?: () => void;
	children?: ReactNode;
};

const LoadingWrapper: FC<Props> = ({ isActive, variant = 'load', onRefresh, children }) => {
	if (!isActive) return <>{children}</>;

	return (
		<Box position="relative" height="100%">
			<Box
				sx={{
					backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
					position: 'absolute',
					zIndex: 10,
					width: '100%',
					height: '100%',
					display: 'flex',
					p: 4,
					alignItems: 'start',
					justifyContent: 'center',
				}}
			>
				{variant === 'refresh' && (
					<IconButton onClick={onRefresh} size="large">
						<SvgIcon fontSize="large">
							<Icons.refresh />
						</SvgIcon>
					</IconButton>
				)}
				{variant === 'load' && <CircularProgress color="inherit" />}
			</Box>
			<div style={{ opacity: 0.4 }}>{children}</div>
		</Box>
	);
};

export default LoadingWrapper;
