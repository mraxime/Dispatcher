import type { NextPage } from 'next';
import { Container } from '@mui/material';
import { getCalendarEvents, getCalendars, getTowings, getUsers } from 'src/server/services';
import { pageGuard } from '../guard';
import CalendarView from './view';

const SchedulePage: NextPage = async () => {
	const session = await pageGuard('calendars:read');

	const [calendar] = await getCalendars({ limit: 1 });
	if (!calendar) throw new Error("Cette entreprise n'a pas encore de calendrier");

	const users = session.permissionKeys.includes('users:read') ? await getUsers() : [];
	const towings = session.permissionKeys.includes('towings:read') ? await getTowings() : [];

	const calendarEvents = await getCalendarEvents(calendar.id, {
		with: {
			userAssignee: session.permissionKeys.includes('users:read') ? true : false,
			towingAssignee: session.permissionKeys.includes('towings:read') ? true : false,
		},
	});

	return (
		<Container maxWidth="xl">
			<CalendarView
				calendar={calendar}
				calendarEvents={calendarEvents}
				users={users}
				towings={towings}
				editable={session.permissionKeys.includes('calendars:update')}
			/>
		</Container>
	);
};

export default SchedulePage;
