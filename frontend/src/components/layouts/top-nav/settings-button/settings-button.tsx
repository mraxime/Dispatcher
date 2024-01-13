import { useRef, useState } from 'react';
import {
	Badge,
	Box,
	Button,
	IconButton,
	Popover,
	Stack,
	SvgIcon,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import Cookies from 'js-cookie';

import type { PaletteMode } from 'src/assets/theme';
import { Icons } from 'src/components/base/Icons';
import { MEASURE_TYPES_MAP, type MeasureType } from 'src/lib/constants/measures';
import { setMeasure, setTheme } from 'src/server/actions/setting.action';

const SettingsButton = () => {
	const ref = useRef<HTMLButtonElement>(null);
	const [isOpen, setOpen] = useState(false);

	const themeInputRef = useRef<HTMLInputElement>(null);
	const measureInputRef = useRef<HTMLInputElement>(null);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSave = () => {
		setOpen(false);
		const themeValue = (themeInputRef.current?.value ?? 'light') as PaletteMode;
		const measureValue = (measureInputRef.current?.value ?? 'METRIC') as MeasureType;

		setTheme(themeValue);
		setMeasure(measureValue);
	};

	return (
		<>
			<Tooltip title="Paramètres">
				<Badge color="secondary" sx={{ marginRight: 0.5 }}>
					<IconButton onClick={handleOpen} ref={ref} size="large">
						<SvgIcon fontSize="small">
							<Icons.settings />
						</SvgIcon>
					</IconButton>
				</Badge>
			</Tooltip>
			<Popover
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				anchorEl={ref.current}
				onClose={handleClose}
				open={isOpen}
			>
				<Box sx={{ width: 320, padding: 2 }}>
					<Typography variant="h6" color="textPrimary">
						Paramètres
					</Typography>
					<Stack spacing={3} mt={3}>
						<div>
							<TextField
								fullWidth
								label="Mesures"
								name="measure"
								select
								SelectProps={{ native: true }}
								defaultValue={Cookies.get('measure-type') ?? 'METRIC'}
								inputRef={measureInputRef}
							>
								{Object.values(MEASURE_TYPES_MAP).map(({ title, value }) => (
									<option key={value} value={value}>
										{title}
									</option>
								))}
							</TextField>
						</div>
						<div>
							<TextField
								fullWidth
								label="Thème"
								name="theme"
								select
								defaultValue={Cookies.get('theme') ?? 'light'}
								SelectProps={{ native: true }}
								inputRef={themeInputRef}
							>
								<option value="light">Jour</option>
								<option value="dark">Nuit</option>
							</TextField>
						</div>
					</Stack>
					<Box mt={4}>
						<Button variant="contained" fullWidth onClick={handleSave}>
							Enregistrer
						</Button>
					</Box>
				</Box>
			</Popover>
		</>
	);
};

export default SettingsButton;
