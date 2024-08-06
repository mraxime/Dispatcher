import type { FC } from 'react';
import { Card, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';

import type { Price } from 'src/lib/types/directus';
import { toCurrency } from 'src/lib/utils';

type Props = {
	data: Price;
};

const PriceCard: FC<Props> = ({ data: price }) => {
	return (
		<Card>
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Id</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{price.id}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Prix</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{toCurrency(price.value)}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Taxable</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{price.taxable ? 'Oui' : 'Non'}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Statut</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{price.status}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default PriceCard;
