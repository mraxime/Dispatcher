'use client';

import { useState, type FC } from 'react';
import {
	Avatar,
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Typography,
} from '@mui/material';
import { Icons } from 'src/components/base/Icons';
import LoadingWrapper from 'src/components/base/LoadingWrapper';
import { useDebounce } from 'src/hooks/useDebounce';
import type { User } from 'src/types';
import { getInitials } from 'src/utils';

type Props = {
	title?: string;
	data: User[];
	isLoading?: boolean;
	onSelect?: (user: User) => void;
	onClose?: () => void;
};

const UsersAsideList: FC<Props> = ({
	title,
	data: users,
	isLoading = false,
	onSelect,
	onClose,
}) => {
	const [selectedUserId, setSelectedUserId] = useState<string>();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const searchValue = useDebounce(searchQuery, 220);
	const isSearching = searchQuery !== searchValue;

	const handleSelect = (user: User) => {
		setSelectedUserId(user.id || undefined);
		if (onSelect) onSelect(user);
	};

	return (
		<Card sx={{ height: '100%' }}>
			{title && (
				<>
					<CardHeader
						title={title}
						action={
							onClose ? (
								<IconButton onClick={onClose}>
									<Icons.close />
								</IconButton>
							) : undefined
						}
					/>
					<Divider />
				</>
			)}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{/* disable for now - <SearchBar placeholder="Recherche" onSearch={setSearchQuery} /> */}
				<Box flex={1} overflow="auto">
					<LoadingWrapper isActive={isSearching || isLoading} variant="load">
						{users.length > 0 ? (
							<List>
								{users.map((user) => (
									<ListItem disablePadding key={user.id}>
										<ListItemButton
											selected={user.id === selectedUserId}
											alignItems="flex-start"
											onClick={() => handleSelect(user)}
										>
											<ListItemAvatar>
												<Avatar alt="User">
													{getInitials(`${user.firstName} ${user.lastName}`)}
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={
													<Typography fontWeight="medium" variant="body2">
														{`${user.firstName} ${user.lastName}`}
													</Typography>
												}
												secondary={
													<Typography variant="caption" color="text.secondary">
														{user.email}
													</Typography>
												}
											/>
										</ListItemButton>
									</ListItem>
								))}
							</List>
						) : (
							<CardContent sx={{ p: 2, pt: 4, display: 'grid', placeItems: 'center' }}>
								<Typography variant="caption" color="textSecondary">
									Aucune donnée
								</Typography>
							</CardContent>
						)}
					</LoadingWrapper>
				</Box>
			</Box>
		</Card>
	);
};

export default UsersAsideList;
