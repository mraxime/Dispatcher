import type { PermissionAction, PermissionGroup } from 'src/lib/constants/permissions';
import type { CustomPermission } from 'src/lib/types/directus';

/**
 * Checks wether or not a specific permission exists in a list.
 * Useful to check user's permissions.
 */
export const hasPermission = (
	permissions: CustomPermission[],
	action: PermissionAction,
	group: PermissionGroup,
): boolean => {
	return permissions.some(
		(permission) => permission.action === action && permission.group === group,
	);
};
