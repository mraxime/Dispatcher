import type { Query } from '@directus/sdk';
import Cookies from 'js-cookie';

import type { DirectusSchema } from 'src/lib/types/directus';

type Params = Query<DirectusSchema, { company: unknown }>;

/**
 * Transform Directus filter params to include the current company from cookie.
 * This makes sure the query data is scoped to the selected company.
 */
export const withCompanyIsolation = <T extends Params>(params?: T): T => {
	const companyCookie = Cookies.get('company');
	const newParams = {
		...params,
		filter: {
			...params?.filter,
			company: {
				...params?.filter?.company,
				_eq: companyCookie,
			},
		},
	};

	return newParams;
};
