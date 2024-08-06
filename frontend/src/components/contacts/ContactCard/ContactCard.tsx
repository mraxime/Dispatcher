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

import type { Contact } from 'src/lib/types/directus';

type Props = {
	data: Contact;
};

const ContactCard: FC<Props> = ({ data: contact }) => {
	return (
		<Card>
			<CardHeader title="Contact d'urgence" />
			<Divider />
			<Table>
				<TableBody>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Prénom</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{contact.first_name}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Nom</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{contact.last_name}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Relation</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{contact.relation}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Téléphone</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{contact.phone}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Poste</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{contact.ext}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ fontWeight: 'fontWeightMedium' }}>Note</TableCell>
						<TableCell>
							<Typography variant="body2" color="textSecondary">
								{contact.note}
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default ContactCard;
