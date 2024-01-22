import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateTrailerSchema, UpdateTrailerSchema } from 'src/lib/schemas/trailer.schema';
import type { TrailerParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class TrailerService {
	api = createFullAccessDirectusApi();

	async getMany(params?: TrailerParams) {
		const result = await this.api.request(readItems('trailers', params));
		return result;
	}

	async getOne(id: number, params?: TrailerParams) {
		const result = await this.api.request(readItem('trailers', id, params));
		return result;
	}

	async create(payload: CreateTrailerSchema) {
		const result = await this.api.request(createItem('trailers', payload));
		return result;
	}

	async update(id: number, payload: UpdateTrailerSchema) {
		const result = await this.api.request(updateItem('trailers', id, payload));
		return result;
	}

	async delete(id: number) {
		await this.api.request(deleteItem('trailers', id));
	}
}
