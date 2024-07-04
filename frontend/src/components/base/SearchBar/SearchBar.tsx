import { forwardRef } from 'react';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { Icons } from 'src/components/base/Icons';

type Props = {
	placeholder?: string;
	onSearch?: (value: string) => void;
	value?: string;
};

const SearchBar = forwardRef<HTMLInputElement, Props>(
	({ placeholder = 'Recherche...', value, onSearch }, ref) => {
		return (
			<Paper
				component="form"
				variant="outlined"
				sx={{ py: 1, pr: 2, display: 'flex', alignItems: 'center' }}
				square
			>
				<IconButton type="submit" aria-label="search">
					<Icons.search />
				</IconButton>
				<InputBase
					ref={ref}
					sx={{ ml: 1, flex: 1 }}
					value={value}
					placeholder={placeholder}
					inputProps={{ 'aria-label': placeholder }}
					onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
				/>
			</Paper>
		);
	},
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
