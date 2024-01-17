import { cookies } from 'next/headers';
import type { Query } from '@directus/sdk';

import type { DirectusSchema } from 'src/lib/types/directus';

type Params = Query<DirectusSchema, { company: unknown }>;

/**
 * Transform Directus filter params to include the current company from cookie.
 * This makes sure the query data is scoped to the selected company.
 */
export const withCompanyIsolation = <T extends Params>(params?: T): T => {
	const companyCookie = cookies().get('company')?.value;
	if (!companyCookie) throw new Error('Cette requête nécessite une entreprise séléctionnée');

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

	return newParams as T;
};
