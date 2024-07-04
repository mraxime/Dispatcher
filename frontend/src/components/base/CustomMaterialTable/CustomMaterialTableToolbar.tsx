import type { FC } from 'react';
import { IconButton, InputAdornment, OutlinedInput, Stack, SvgIcon, Tooltip } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';
import { Icons } from 'src/components/base/Icons';

type Props = {
	searchText?: string;
	onSearch?: (value: string) => void;
	onRefresh?: () => void;
};

const CustomMaterialTableToolbar: FC<Props> = ({ searchText = '', onSearch, onRefresh }) => {
	const handleSearch = useDebouncedCallback((value: string) => onSearch?.(value), 250);

	return (
		<Stack direction="row" alignItems="center" justifyContent="space-between" p={2} gap={2}>
			<OutlinedInput
				fullWidth
				placeholder="Recherche..."
				defaultValue={searchText}
				onChange={(e) => handleSearch(e.target.value)}
				startAdornment={
					<InputAdornment position="start">
						<SvgIcon>
							<Icons.search />
						</SvgIcon>
					</InputAdornment>
				}
			/>
			<Tooltip title="Mettre à jour">
				<IconButton size="large" onClick={onRefresh}>
					<SvgIcon>
						<Icons.refresh />
					</SvgIcon>
				</IconButton>
			</Tooltip>
		</Stack>
	);
};

export default CustomMaterialTableToolbar;
