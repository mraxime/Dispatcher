import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateServiceSchema, UpdateServiceSchema } from 'src/lib/schemas/service.schema';
import type { ServiceParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class ServiceService {
	api = createFullAccessDirectusApi();

	async getMany(params?: ServiceParams) {
		const result = await this.api.request(readItems('services', params));
		return result;
	}

	async getOne(id: number, params?: ServiceParams) {
		const result = await this.api.request(readItem('services', id, params));
		return result;
	}

	async create(payload: CreateServiceSchema) {
		const result = await this.api.request(createItem('services', payload));
		return result;
	}

	async update(id: number, payload: UpdateServiceSchema) {
		const result = await this.api.request(updateItem('services', id, payload));
		return result;
	}

	async delete(id: number) {
		await this.api.request(deleteItem('services', id));
	}
}
