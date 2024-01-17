import type { NextPage } from 'next';
import { Container } from '@mui/material';

import CalendarPage from 'src/components/calendars/CalendarPage';
import { getCalendars } from 'src/server/actions/calendar.action';
import { getTrailers } from 'src/server/actions/trailer.action';
import { getUsers } from 'src/server/actions/user.action';

const SchedulePage: NextPage = async () => {
	const [calendars, users, trailers] = await Promise.all([
		getCalendars({ limit: 1, fields: ['*', { events: ['*'] }] }),
		getUsers(),
		getTrailers(),
	]);

	const calendar = calendars[0];
	if (!calendar) throw new Error("Cette entreprise n'a pas encore de calendrier");

	return (
		<Container maxWidth="xl">
			<CalendarPage
				calendar={calendar}
				calendarEvents={calendar.events}
				users={users}
				trailers={trailers}
			/>
		</Container>
	);
};

export default SchedulePage;
