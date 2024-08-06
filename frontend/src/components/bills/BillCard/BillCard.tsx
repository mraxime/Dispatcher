import type { FC } from 'react';
import {
	Card,
	CardHeader,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';
import { format } from 'date-fns';

import type { Bill } from 'src/lib/types/directus';

type Props = {
	data: Bill;
};

const BillCard: FC<Props> = ({ data: bill }) => {
	return (
		<Card>
			<CardHeader title="Facture" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Id</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{bill.id}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Date de création</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{format(new Date(bill.date_created), 'dd/MM/yyyy')}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Statut</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{bill.status}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Note</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{bill.note ?? 'N/A'}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default BillCard;
