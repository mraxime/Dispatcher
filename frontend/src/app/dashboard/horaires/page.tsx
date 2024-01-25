import type { NextPage } from 'next';
import { Container } from '@mui/material';

import { getCalendars } from 'src/server/actions/calendar.action';
import { getTrailers } from 'src/server/actions/trailer.action';
import { getUsers } from 'src/server/actions/user.action';
import CalendarView from './view';

const SchedulePage: NextPage = async () => {
	const [calendars, users, trailers] = await Promise.all([
		getCalendars({
			limit: 1,
			fields: [
				'*',
				{ events: ['*', { user_assignee: ['*', { role: ['*'] }], trailer_assignee: ['*'] }] },
			],
		}),
		getUsers(),
		getTrailers(),
	]);

	const calendar = calendars[0];
	if (!calendar) throw new Error("Cette entreprise n'a pas encore de calendrier");

	return (
		<Container maxWidth="xl">
			<CalendarView calendar={calendar} users={users} trailers={trailers} />
		</Container>
	);
};

export default SchedulePage;
