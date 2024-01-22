import { createItem, deleteItem, readItem, readItems, updateItem } from '@directus/sdk';

import type { CreateBillSchema, UpdateBillSchema } from 'src/lib/schemas/bill.schema';
import type { BillParams } from 'src/lib/types/directus';
import { createFullAccessDirectusApi } from '../directus';

export class BillService {
	api = createFullAccessDirectusApi();

	async getMany(params?: BillParams) {
		const result = await this.api.request(readItems('bills', params));
		return result;
	}

	async getOne(id: number, params?: BillParams) {
		const result = await this.api.request(readItem('bills', id, params));
		return result;
	}

	async create(payload: CreateBillSchema) {
		const result = await this.api.request(createItem('bills', payload));
		return result;
	}

	async update(id: number, payload: UpdateBillSchema) {
		const result = await this.api.request(updateItem('bills', id, payload));
		return result;
	}

	async delete(id: number) {
		await this.api.request(deleteItem('bills', id));
	}
}
