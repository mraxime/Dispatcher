import { createInsertSchema } from 'drizzle-zod';
import { calendarEventTable } from 'src/server/database/schema';

export const createCalendarEventSchema = createInsertSchema(calendarEventTable).refine(
	(data) => data.start < data.end,
	{
		message: 'Doit se situer après la date de début',
		path: ['end'], // This sets the error to the 'end' field
	},
);

export const updateCalendarEventSchema = createCalendarEventSchema
	.innerType()
	.deepPartial()
	.refine(
		(data) => {
			// If both dates are provided, end date must be after start date
			if (data.start && data.end) {
				return data.start < data.end;
			}
			// If only one date is provided, the data is valid
			return true;
		},
		{
			message: 'Doit se situer après la date de début',
			path: ['end'], // This sets the error to the 'end' field
		},
	);
