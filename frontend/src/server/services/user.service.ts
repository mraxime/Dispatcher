import {
	createUser,
	deleteUser,
	readItems,
	readRoles,
	readUser,
	readUsers,
	updateUser,
} from '@directus/sdk';

import type { USER_ROLES } from 'src/lib/constants/roles';
import type { CreateUserSchema, UpdateUserSchema } from 'src/lib/schemas/user.schema';
import type { PermissionParams, RoleParams, UserParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class UserService {
	api = createFullAccessDirectusApi();

	async getMany(params?: UserParams) {
		// @ts-expect-error - Looks fine.
		const result = await this.api.request(readUsers(params));
		return result;
	}

	async getOne(id: string, params?: UserParams) {
		// @ts-expect-error - Looks fine.
		const result = await this.api.request(readUser(id, params));
		return result;
	}

	async create(payload: CreateUserSchema) {
		if (payload.permissions) {
			payload = {
				...payload,
				// @ts-expect-error - API permissions takes this junction format
				permissions: payload.permissions.map((id) => ({ custom_permissions_id: id })),
			};
		}

		// @ts-expect-error - Looks fine.
		const result = await this.api.request(createUser(payload));
		return result;
	}

	async update(id: string, payload: UpdateUserSchema) {
		if (payload.permissions) {
			payload = {
				...payload,
				// @ts-expect-error - API permissions takes this junction format
				permissions: payload.permissions.map((id) => ({ custom_permissions_id: id })),
			};
		}

		// @ts-expect-error - Looks fine.
		const result = await this.api.request(updateUser(id, payload));
		return result;
	}

	async delete(id: string) {
		await this.api.request(deleteUser(id));
	}

	async getPermissions(params?: PermissionParams) {
		const result = await this.api.request(readItems('custom_permissions', params));
		return result;
	}

	async getRoles(params?: RoleParams) {
		// @ts-expect-error - Looks fine.
		const result = await this.api.request(readRoles(params));
		return result;
	}

	async getRoleByName(name: (typeof USER_ROLES)[number]) {
		const result = await this.api.request(readRoles({ filter: { name: { _eq: name } }, limit: 1 }));
		return result[0];
	}
}
