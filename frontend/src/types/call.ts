import type { InferSelectModel } from 'drizzle-orm';
import type { z } from 'zod';
import type { callTable } from 'src/server/database/schema';
import type { callParamsSchema, createCallSchema } from 'src/validations/call';
import type { Client, ClientVehicle, Service, Towing, User } from '.';

export type Call = InferSelectModel<typeof callTable>;
export type CallInput = z.infer<typeof createCallSchema>;
export type CallParams = z.input<typeof callParamsSchema>;

export type CallWithRelations = Call & {
	client?: Client;
	driver?: User;
	service?: Service;
	towing?: Towing;
	vehicle?: ClientVehicle;
};
