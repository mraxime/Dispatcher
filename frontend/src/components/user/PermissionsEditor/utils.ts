import type { Icon } from 'react-feather';
import { Icons } from 'src/components/base/Icons';
import { PERMISSION_KEYS, type PermissionKey } from 'src/constants/user';
import type { Permission } from 'src/types';

type GroupedPermissions = Record<
	string /* permission group */,
	Record<string /* permission action */, Permission>
>;

/**
 * Function that restructures an array of permissions into an organized object.
 * This allows for efficient retrieval of specific permissions using their group and action as identifiers.
 *
 * Result format example:
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
export const groupPermissionsByGroup = (permissions: Permission[]): GroupedPermissions => {
	const result: GroupedPermissions = {};
	for (const permission of permissions) {
		// split permission key (eg: 'users:create' >> ['users', 'create'])
		const [group, action] = permission.key.split(':');
		if (!group || !action) throw new Error('PermissionKey has an invalid format');

		if (!result.hasOwnProperty(group)) result[group] = {};
		result[group]![action] = permission;
	}
	return result;
};

const _splitGroupActionFromPermissionKeys = (
	permissionKeys: readonly PermissionKey[],
): [string[], string[]] => {
	const groups = [];
	const actions = [];
	for (const permissionKey of permissionKeys) {
		// split permission key (eg: 'users:create' >> ['users', 'create'])
		const [group, action] = permissionKey.split(':');
		if (!group || !action) throw new Error('PermissionKey has an invalid format');
		groups.push(group);
		actions.push(action);
	}

	return [groups, actions];
};

const [groups, actions] = _splitGroupActionFromPermissionKeys(PERMISSION_KEYS);

const GROUP_TITLE_MAP = new Map([
	['bills', 'Factures'],
	['calendars', 'Calendriers'],
	['calendar-events', 'Événements de calendrier'],
	['calls', 'Appels'],
	['clients', 'Clients'],
	['companies', 'Entreprises'],
	['messages', 'Messages chat'],
	['prices', 'Tarifs'],
	['services', 'Services'],
	['towings', 'Remorques'],
	['users', 'Utilisateurs'],
]);

const ACTION_TITLE_MAP = new Map([
	['read', 'Visualiser'],
	['create', 'Créer'],
	['update', 'Mettre à jour'],
	['delete', 'Supprimer'],
]);

const ACTION_ICON_MAP: Record<string, Icon> = {
	read: Icons.view,
	create: Icons.add,
	update: Icons.edit,
	delete: Icons.delete,
};

export const PERMISSION_GROUPS_MAP = (() => {
	const result: Record<string /* group */, { value: string /* group */; title: string }> = {};

	for (const group of groups) {
		result[group] = {
			value: group,
			title: GROUP_TITLE_MAP.get(group) ?? group,
		};
	}

	return result;
})();

export const PERMISSION_ACTIONS_MAP = (() => {
	const result: Record<
		string /* action */,
		{
			value: string /* action */;
			title: string;
			Icon: Icon;
		}
	> = {};

	for (const action of actions) {
		result[action] = {
			value: action,
			title: ACTION_TITLE_MAP.get(action) ?? action,
			Icon: ACTION_ICON_MAP[action] ?? Icons.more,
		};
	}

	return result;
})();
