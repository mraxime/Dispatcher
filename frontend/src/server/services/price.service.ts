import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreatePriceSchema, UpdatePriceSchema } from 'src/lib/schemas/price.schema';
import type { PriceParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class PriceService {
	api = createFullAccessDirectusApi();

	async getMany(params?: PriceParams) {
		const result = await this.api.request(readItems('prices', params));
		return result;
	}

	async getOne(id: number, params?: PriceParams) {
		const result = await this.api.request(readItem('prices', id, params));
		return result;
	}

	async create(payload: CreatePriceSchema) {
		const result = await this.api.request(createItem('prices', payload));
		return result;
	}

	async update(id: number, payload: UpdatePriceSchema) {
		const result = await this.api.request(updateItem('prices', id, payload));
		return result;
	}

	async delete(id: number) {
		await this.api.request(deleteItem('prices', id));
	}
}
