import { readMe, updateMe } from '@directus/sdk';

import type { UserLoginSubmitData } from 'src/components/users/UserLoginForm';
import type { UpdateUserSchema } from 'src/lib/schemas/user.schema';
import type { UserParams } from 'src/lib/types/directus';
import { createDirectusApi } from '../directus';

export class AuthService {
	async login(payload: UserLoginSubmitData) {
		const api = createDirectusApi();
		await api.login(payload.email, payload.password);
	}

	async logout() {
		const api = createDirectusApi();
		await api.logout();
	}

	async getMe(params?: UserParams) {
		const api = createDirectusApi();
		// @ts-expect-error - Looks fine.
		const result = await api.request(readMe(params));
		return result;
	}

	async updateMe(payload: UpdateUserSchema, params?: UserParams) {
		const api = createDirectusApi();
		// @ts-expect-error - Looks fine.
		const result = await api.request(updateMe(payload, params));
		return result;
	}
}
