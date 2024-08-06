import type { FC } from 'react';
import {
	Card,
	CardActions,
	CardHeader,
	Divider,
	Stack,
	SvgIcon,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';

import { Icons } from 'src/components/base/Icons';
import type { PriceType } from 'src/lib/constants/prices';
import type { Call } from 'src/lib/types/directus';
import { getTaxAmount, getTPS, getTVQ, toCurrency } from 'src/lib/utils';

type Props = {
	data: Call;
};

const CallPriceCard: FC<Props> = ({ data: call }) => {
	let callPrices = call.service?.prices?.map((value) => value?.prices_id) ?? [];

	// ignore other price types for now
	callPrices = callPrices.filter((value) => (value?.type as PriceType) === 'BASE');

	let total = 0;
	callPrices.map((price) => {
		total += price?.value ?? 0;
	});

	const taxAmount = getTaxAmount(total);

	return (
		<Card variant="outlined">
			<CardHeader
				title={<Typography variant="h5">Prix du service</Typography>}
				avatar={
					<SvgIcon color="primary">
						<Icons.price />
					</SvgIcon>
				}
				subheader={call.service?.name}
				sx={{ p: 2, bgcolor: 'background.default' }}
			/>
			<Divider />
			<Table>
				<TableBody>
					{callPrices.map((price) => (
						<TableRow key={price?.id}>
							<TableCell sx={{ fontWeight: 'fontWeightMedium', verticalAlign: 'top' }}>
								<Typography>{price?.name}</Typography>
							</TableCell>
							<TableCell align="right">
								<Stack>
									<Typography variant="body2" color="textSecondary">
										{`Prix: ${toCurrency(price?.value, {
											priceType: price?.type as PriceType,
										})}`}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										{`Qté: 1`}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										{`Facturé: ${toCurrency(price?.value)}`}
									</Typography>
								</Stack>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<CardActions
				sx={{
					bgcolor: 'background.default',
					textAlign: 'right',
					width: '100%',
				}}
			>
				<Stack
					sx={{
						textAlign: 'right',
						width: '100%',
					}}
				>
					<Typography variant="caption">Sous-Total: {toCurrency(total)}</Typography>
					<Typography variant="caption">TPS: {toCurrency(getTPS(total))}</Typography>
					<Typography variant="caption">TVQ: {toCurrency(getTVQ(total))}</Typography>
					<Typography variant="body2" fontWeight="bold">
						Total: {toCurrency(total + taxAmount)}
					</Typography>
				</Stack>
			</CardActions>
		</Card>
	);
};

export default CallPriceCard;
