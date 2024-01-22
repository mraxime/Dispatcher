import { cookies } from 'next/headers';
import { readMe, updateMe } from '@directus/sdk';

import type { UserLoginSubmitData } from 'src/components/users/UserLoginForm';
import type { UpdateUserSchema } from 'src/lib/schemas/user.schema';
import type { User } from 'src/lib/types/directus';
import { isObject } from 'src/lib/utils';
import { createDirectusApi } from '../directus';

export class AuthService {
	async login(payload: UserLoginSubmitData) {
		const api = createDirectusApi();
		await api.login(payload.email, payload.password);

		// select current company by default
		const me = await this.getMe();
		if (isObject(me.company)) cookies().set('company', String(me.company.id));
	}

	async logout() {
		const api = createDirectusApi();
		await api.logout();
	}

	async getMe() {
		const api = createDirectusApi();
		const result = (await api.request(
			readMe({ fields: ['*', '*.*', '*.*.*'] }),
		)) as unknown as User;

		return result;
	}

	async updateMe(payload: UpdateUserSchema) {
		const api = createDirectusApi();
		const result = (await api.request(updateMe(payload))) as unknown as User;
		return result;
	}
}
