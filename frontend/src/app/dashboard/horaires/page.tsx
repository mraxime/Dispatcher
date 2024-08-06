'use client';

import type { NextPage } from 'next';
import { Container } from '@mui/material';

import CalendarPage from 'src/components/calendars/CalendarPage';

const SchedulePage: NextPage = () => {
	return (
		<Container maxWidth="xl">
			<CalendarPage />
		</Container>
	);
};

export default SchedulePage;
