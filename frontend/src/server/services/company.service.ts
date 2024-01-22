import { createItem, deleteItem, readItem, readItems, updateItem, updateUser } from '@directus/sdk';

import type { CreateCompanySchema, UpdateCompanySchema } from 'src/lib/schemas/company.schema';
import type { CompanyParams } from 'src/lib/types/directus';
import { getPermissions, getRoleByName } from '../actions/user.action';
import { createFullAccessDirectusApi } from '../directus';

export class CompanyService {
	api = createFullAccessDirectusApi();

	async getMany(params?: CompanyParams) {
		const result = await this.api.request(readItems('companies', params));
		return result;
	}

	async getOne(id: number, params?: CompanyParams) {
		const result = await this.api.request(readItem('companies', id, params));
		return result;
	}

	async create(payload: CreateCompanySchema) {
		// New company admin handler
		const superAdminRole = await getRoleByName('Super Admin');
		const permissions = await getPermissions();
		const permissionIds = permissions.map(({ id }) => id);

		// Admin data without id means it will be created
		const hasNewAdmin = !!payload.admin && !payload.admin.id;

		// modify data to set default role and permissions on the new admin
		if (hasNewAdmin) {
			payload = {
				...payload,
				admin: {
					...payload.admin,
					role: superAdminRole?.id,
					permissions: permissionIds,
				},
			};
		}

		// Ease junction format
		if (payload.admin?.permissions) {
			const permissionsFormat = payload.admin.permissions.map((id) => ({
				custom_permissions_id: id,
			}));
			// @ts-expect-error - API permissions takes this junction format
			payload = { ...payload, admin: { ...payload.admin, permissions: permissionsFormat } };
		}

		const result = await this.api.request(createItem('companies', payload));

		// attach new admin to this company
		if (result.admin) {
			await this.api.request(updateUser(result.admin as string, { company: result.id }));
		}

		return result;
	}

	async update(id: number, payload: UpdateCompanySchema) {
		// New company admin handler
		const superAdminRole = await getRoleByName('Super Admin');
		const permissions = await getPermissions();
		const permissionIds = permissions.map(({ id }) => id);

		// Admin data without id means it will be created
		const hasNewAdmin = !!payload.admin && !payload.admin.id;

		// modify data to set default role and permissions on the new admin
		if (hasNewAdmin) {
			payload = {
				...payload,
				admin: {
					...payload.admin,
					role: superAdminRole?.id,
					permissions: permissionIds,
				},
			};
		}

		// Ease junction format
		if (payload.admin?.permissions) {
			const permissionsFormat = payload.admin.permissions.map((id) => ({
				custom_permissions_id: id,
			}));
			// @ts-expect-error - API permissions takes this junction format
			payload = { ...payload, admin: { ...payload.admin, permissions: permissionsFormat } };
		}

		const result = await this.api.request(updateItem('companies', id, payload));

		// attach new admin to this company
		if (result.admin) {
			await this.api.request(updateUser(result.admin as string, { company: result.id }));
		}

		return result;
	}

	async delete(id: number) {
		const result = await this.api.request(deleteItem('companies', id));
		return result;
	}
}
