import type { FC } from 'react';
import { Card, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';

import type { Client } from 'src/lib/types/directus';

type Props = {
	data: Client;
};

const ClientInfos: FC<Props> = ({ data: client }) => {
	return (
		<Card>
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Id</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{client.id}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Nom d'entreprise</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{client.companyName}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Nom du responsable</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{client.name}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Téléphone</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{client.phone}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Courriel</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{client.email}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Statut</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{client.status}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default ClientInfos;
