import { useRef, type FC } from 'react';
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
import { Icons } from 'src/components/base/Icons';
import {
	MEASURE_TYPES,
	MEASURE_TYPES_MAP,
	THEME_MODES,
	THEME_MODES_MAP,
	type MeasureType,
	type ThemeMode,
} from 'src/constants/settings';
import useDisclosure from 'src/hooks/useDisclosure';
import { setMeasureType, setThemeMode } from 'src/server/actions/settings';

type Props = {
	measureType: MeasureType;
	themeMode: ThemeMode;
};

const SettingsButton: FC<Props> = ({ measureType, themeMode }) => {
	const ref = useRef<HTMLButtonElement>(null);
	const disclosure = useDisclosure();

	const themeInputRef = useRef<HTMLInputElement>(null);
	const measureInputRef = useRef<HTMLInputElement>(null);

	const handleSave = async () => {
		const themeValue = themeInputRef.current?.value as ThemeMode;
		if (themeValue !== themeMode) await setThemeMode(themeValue);

		const measureValue = measureInputRef.current?.value as MeasureType;
		if (measureType !== measureValue) await setMeasureType(measureValue);

		disclosure.close();
	};

	return (
		<>
			<Tooltip title="Paramètres">
				<Badge color="secondary" sx={{ marginRight: 0.5 }}>
					<IconButton onClick={disclosure.open} ref={ref} size="large">
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
				onClose={disclosure.close}
				open={disclosure.isOpen}
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
								name="measureType"
								select
								SelectProps={{ native: true }}
								defaultValue={measureType}
								inputRef={measureInputRef}
							>
								{MEASURE_TYPES.map((type) => (
									<option key={type} value={type}>
										{MEASURE_TYPES_MAP[type].title}
									</option>
								))}
							</TextField>
						</div>
						<div>
							<TextField
								fullWidth
								label="Thème"
								name="themeMode"
								select
								defaultValue={themeMode}
								SelectProps={{ native: true }}
								inputRef={themeInputRef}
							>
								{THEME_MODES.map((mode) => (
									<option key={mode} value={mode}>
										{THEME_MODES_MAP[mode].title}
									</option>
								))}
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
