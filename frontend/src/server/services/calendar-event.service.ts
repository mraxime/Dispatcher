import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type {
	CreateCalendarEventSchema,
	UpdateCalendarEventSchema,
} from 'src/lib/schemas/calendar-event.schema';
import type { CalendarEventParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class CalendarEventService {
	api = createFullAccessDirectusApi();

	async getMany(params?: CalendarEventParams) {
		const result = await this.api.request(readItems('calendar_events', params));
		return result;
	}

	async getOne(id: string, params?: CalendarEventParams) {
		const result = await this.api.request(readItem('calendar_events', id, params));
		return result;
	}

	async create(payload: CreateCalendarEventSchema) {
		const result = await this.api.request(createItem('calendar_events', payload));
		return result;
	}

	async update(id: string, payload: UpdateCalendarEventSchema) {
		const result = await this.api.request(updateItem('calendar_events', id, payload));
		return result;
	}

	async delete(id: string) {
		await this.api.request(deleteItem('calendar_events', id));
	}
}
