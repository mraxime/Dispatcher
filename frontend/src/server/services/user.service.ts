import {
	createUser,
	deleteUser,
	readItems,
	readRoles,
	readUser,
	readUsers,
	updateUser,
} from '@directus/sdk';

import type { SUPER_USER_ROLES } from 'src/lib/constants/roles';
import type { CreateUserSchema, UpdateUserSchema } from 'src/lib/schemas/user.schema';
import type { PermissionParams, Role, RoleParams, User, UserParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class UserService {
	api = createFullAccessDirectusApi();

	async getMany(params?: UserParams) {
		const result = (await this.api.request(
			// @ts-expect-error - Looks fine.
			readUsers(params),
		)) as unknown as User[];
		return result;
	}

	async getOne(id: string, params?: UserParams) {
		const result = (await this.api.request(
			// @ts-expect-error - Looks fine.
			readUser(id, params),
		)) as unknown as User;
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

		const result = (await this.api.request(createUser(payload))) as unknown as User;
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

		const result = (await this.api.request(updateUser(id, payload))) as unknown as User;
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
		const result = (await this.api.request(readRoles(params))) as unknown as Role[];
		return result;
	}

	async getRoleByName(name: (typeof SUPER_USER_ROLES)[number]) {
		const result = await this.api.request(readRoles({ filter: { name: { _eq: name } }, limit: 1 }));
		return result[0];
	}
}
