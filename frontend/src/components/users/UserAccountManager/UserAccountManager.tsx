'use client';

import { useState, type FC } from 'react';
import { Box, Divider, Grid, Stack, Tab, Tabs } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import UserPasswordForm from 'src/components/users/UserPasswordForm';
import UserProfileForm, { type UserProfileSubmitData } from 'src/components/users/UserProfileForm';
import type { User } from 'src/lib/types/directus';
import UserAvatarManager from './UserAvatarManager';

type Props = {
	data: User;
	onSubmit?: (formValues: UserProfileSubmitData) => Promise<void>;
	sx?: SxProps;
};

const UserAccountManager: FC<Props> = ({ data: user, onSubmit, sx }) => {
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
							<UserProfileForm
								// @ts-expect-error - user.company is (probably) just an id.
								defaultValues={user}
								onSubmit={onSubmit}
							/>
						</Grid>
					</Grid>
				)}
				{currentTab === 'security' && <UserPasswordForm onSubmit={onSubmit} />}
			</Box>
		</Stack>
	);
};

export default UserAccountManager;
