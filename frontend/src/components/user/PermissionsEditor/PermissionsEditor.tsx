import { useMemo, type FC } from 'react';
import {
	Box,
	Checkbox,
	SvgIcon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material';
import type { Permission } from 'src/types';
import { groupPermissionsByGroup, PERMISSION_ACTIONS_MAP, PERMISSION_GROUPS_MAP } from './utils';

const permissionActions = Object.values(PERMISSION_ACTIONS_MAP);
const permissionGroups = Object.values(PERMISSION_GROUPS_MAP);

type Props = {
	data: Permission[];
	selected: string[];
	onChange: (selectedPermissions: string[]) => void;
};

const PermissionsEditor: FC<Props> = ({ data: permissions, selected, onChange }) => {
	const groupedPermissions = useMemo(() => groupPermissionsByGroup(permissions), [permissions]);

	return (
		<Table stickyHeader size="small">
			<TableHead>
				<TableRow>
					<TableCell width="100%">Catégorie</TableCell>
					{permissionActions.map((action) => (
						<TableCell
							key={action.value}
							align="right"
							sx={{
								px: 0.5,
								':first-child': { pl: 1.5 },
								':last-child': { pr: 1.3 },
							}}
						>
							<Box pr={2}>
								<Tooltip title={action.title} placement="top">
									<SvgIcon fontSize="small">
										<action.Icon />
									</SvgIcon>
								</Tooltip>
							</Box>
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{permissionGroups.map((group) => {
					return (
						<TableRow key={group.value}>
							<TableCell>
								<Typography color="text.secondary" variant="body2">
									{group.title}
								</Typography>
							</TableCell>

							{permissionActions.map((action) => {
								const permission = groupedPermissions[group.value]?.[action.value];
								if (!permission) return null;
								const isChecked = permission ? selected.includes(permission.id) : false;

								return (
									<TableCell
										key={`${group.value}--${permission.key}`}
										align="right"
										sx={{
											px: 1,
											':first-child': { pl: 2 },
											':last-child': { pr: 2 },
										}}
									>
										<Tooltip
											arrow
											title={permission.description}
											PopperProps={{ sx: { fontSize: '4px', pointerEvents: 'none' } }}
											enterDelay={900}
											enterNextDelay={800}
										>
											<Checkbox
												checked={isChecked}
												onChange={(e) => {
													onChange(
														e.target.checked
															? [...selected, permission.id]
															: selected.filter((value) => value !== permission.id),
													);
												}}
											/>
										</Tooltip>
									</TableCell>
								);
							})}
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};

export default PermissionsEditor;
