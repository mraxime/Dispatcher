'use server';

import { revalidatePath } from 'next/cache';

import type { USER_ROLES } from 'src/lib/constants/roles';
import { type CreateUserSchema, type UpdateUserSchema } from 'src/lib/schemas/user.schema';
import type { PermissionParams, Role, RoleParams, UserParams } from 'src/lib/types/directus';
import { UserService } from '../services/user.service';
import { withCompanyIsolation } from './utils';

const userService = new UserService();

/**
 * Get many users. Can apply filters.
 */
export const getUsers = async (params?: UserParams) => {
	const result = await userService.getMany(withCompanyIsolation(params));
	return result;
};

/**
 * Get a single user by ID.
 */
export const getUser = async (id: string, params?: UserParams, companyIsolation = true) => {
	const result = await userService.getOne(
		id,
		companyIsolation ? withCompanyIsolation(params) : params,
	);
	return result;
};

/**
 * Create a user.
 */
export const createUser = async (payload: CreateUserSchema) => {
	const result = await userService.create(payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Update a user.
 */
export const updateUser = async (id: string, payload: UpdateUserSchema) => {
	const result = await userService.update(id, payload);
	revalidatePath('/', 'layout');
	return result;
};

/**
 * Delete a user by ID.
 */
export const deleteUser = async (id: string) => {
	await userService.delete(id);
	revalidatePath('/', 'layout');
};

/**
 * Get list of all user permissions.
 */
export const getPermissions = async (params?: PermissionParams) => {
	const result = await userService.getPermissions(params);
	return result;
};

/**
 * Get list of all user roles.
 */
export const getRoles = async (params?: RoleParams) => {
	const result = await userService.getRoles(params);
	return result as unknown as Role[];
};

/**
 * Get a single user role by name.
 */
export const getRoleByName = async (name: (typeof USER_ROLES)[number]) => {
	const result = await userService.getRoleByName(name);
	return result;
};
