import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateCalendarSchema, UpdateCalendarSchema } from 'src/lib/schemas/calendar.schema';
import type { CalendarParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class CalendarService {
	api = createFullAccessDirectusApi();

	async getMany(params?: CalendarParams) {
		const result = await this.api.request(readItems('calendars', params));
		return result;
	}

	async getOne(id: string, params?: CalendarParams) {
		const result = await this.api.request(readItem('calendars', id, params));
		return result;
	}

	async create(payload: CreateCalendarSchema) {
		const result = await this.api.request(createItem('calendars', payload));
		return result;
	}

	async update(id: string, payload: UpdateCalendarSchema) {
		const result = await this.api.request(updateItem('calendars', id, payload));
		return result;
	}

	async delete(id: string) {
		await this.api.request(deleteItem('calendars', id));
	}
}
