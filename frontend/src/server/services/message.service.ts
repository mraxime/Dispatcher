import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateMessageSchema, UpdateMessageSchema } from 'src/lib/schemas/message.schema';
import type { MessageParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class MessageService {
	api = createFullAccessDirectusApi();

	async getMany(params?: MessageParams) {
		const result = await this.api.request(readItems('messages', params));
		return result;
	}

	async getOne(id: number, params?: MessageParams) {
		const result = await this.api.request(readItem('messages', id, params));
		return result;
	}

	async create(payload: CreateMessageSchema) {
		const result = await this.api.request(createItem('messages', payload));
		return result;
	}

	async update(id: number, payload: UpdateMessageSchema) {
		const result = await this.api.request(updateItem('messages', id, payload));
		return result;
	}

	async delete(id: number) {
		await this.api.request(deleteItem('messages', id));
	}
}
