import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateCallSchema, UpdateCallSchema } from 'src/lib/schemas/call.schema';
import type { CallParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class CallService {
	api = createFullAccessDirectusApi();

	async getMany(params?: CallParams) {
		const result = await this.api.request(readItems('calls', params));
		return result;
	}

	async getOne(id: number, params?: CallParams) {
		const result = await this.api.request(readItem('calls', id, params));
		return result;
	}

	async create(payload: CreateCallSchema) {
		const result = await this.api.request(createItem('calls', payload));
		return result;
	}

	async update(id: number, payload: UpdateCallSchema) {
		const result = await this.api.request(updateItem('calls', id, payload));
		return result;
	}

	async delete(id: number) {
		await this.api.request(deleteItem('calls', id));
	}
}
