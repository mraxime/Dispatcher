import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateClientSchema, UpdateClientSchema } from 'src/lib/schemas/client.schema';
import type { ClientParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class ClientService {
	api = createFullAccessDirectusApi();

	async getMany(params?: ClientParams) {
		const result = await this.api.request(readItems('clients', params));
		return result;
	}

	async getOne(id: number, params?: ClientParams) {
		const result = await this.api.request(readItem('clients', id, params));
		return result;
	}

	async create(payload: CreateClientSchema) {
		const result = await this.api.request(createItem('clients', payload));
		return result;
	}

	async update(id: number, payload: UpdateClientSchema) {
		const result = await this.api.request(updateItem('clients', id, payload));
		return result;
	}

	async delete(id: number) {
		await this.api.request(deleteItem('clients', id));
	}
}
