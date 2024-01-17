import {
	PERMISSION_ACTIONS_MAP,
	PERMISSION_GROUPS_MAP,
	type PermissionAction,
	type PermissionGroup,
} from 'src/lib/constants/permissions';
import type { Permission } from 'src/lib/types/directus';

type GroupedPermissions = Record<PermissionGroup, Record<PermissionAction, Permission>>;

/**
 * Function that restructures an array of permissions into an organized object.
 * This allows for efficient retrieval of specific permissions using their group and action as identifiers.
 */
export const groupPermissionsByGroup = (permissions: Permission[]): GroupedPermissions => {
	const result = createInitialStructure();
	for (const permission of permissions) {
		if (!permission.group || !permission.action) {
			throw new Error(`Permission group or action is missing in ${JSON.stringify(permission)}`);
		}
		result[permission.group][permission.action] = permission;
	}
	return result;
};

/**
 * Creates an organized object structure for permissions.
 *
 * Result format:
 * {
 *	BILL: {
 *	  CREATE: <permission>
 *	  READ: <permission>
 *	  UPDATE: <permission>
 *	  DELETE: <permission>
 *	},
 *	CALL: {
 *	  ...
 *  },
 * }
 */
const createInitialStructure = (): GroupedPermissions => {
	const initialStructure: GroupedPermissions = {} as GroupedPermissions;
	for (const group of Object.keys(PERMISSION_GROUPS_MAP)) {
		// @ts-expect-error - it's ok typescript.
		initialStructure[group] = {};
		for (const action of Object.keys(PERMISSION_ACTIONS_MAP)) {
			// @ts-expect-error - it's ok typescript.
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			initialStructure[group][action] = {};
		}
	}
	return initialStructure;
};
