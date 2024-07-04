'use client';

import { useState, type FC } from 'react';
import { Box, Container, Divider, Grid, Stack, Tab, Tabs } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import UserPasswordForm from 'src/components/user/UserPasswordForm';
import UserProfileForm from 'src/components/user/UserProfileForm';
import type { User } from 'src/types';
import UserAvatarManager from './UserAvatarManager';

type Props = {
	data: User;
	sx?: SxProps;
};

const UserAccountManager: FC<Props> = ({ data: user, sx }) => {
	const [currentTab, setCurrentTab] = useState('details');

	return (
		<Stack sx={sx}>
			<Tabs
				onChange={(_, value: string) => setCurrentTab(value)}
				scrollButtons="auto"
				value={currentTab}
				variant="scrollable"
			>
				<Tab label="Détails" value="details" />
				<Tab label="Sécurité" value="security" />
			</Tabs>
			<Divider />
			<Box flexGrow={1} mt={4}>
				{currentTab === 'details' && (
					<Grid container spacing={4}>
						<Grid item lg={4} md={6} xl={3} xs={12}>
							<UserAvatarManager data={user} />
						</Grid>
						<Grid item lg={8} md={6} xl={9} xs={12}>
							<UserProfileForm defaultValues={user} />
						</Grid>
					</Grid>
				)}
				{currentTab === 'security' && (
					<Box maxWidth="md">
						<UserPasswordForm />
					</Box>
				)}
			</Box>
		</Stack>
	);
};

export default UserAccountManager;
