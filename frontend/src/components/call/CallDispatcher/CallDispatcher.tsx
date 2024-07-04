'use client';

import { useState, type FC } from 'react';
import { Button, Stack } from '@mui/material';
import type { z } from 'zod';
import { useCallActions } from 'src/hooks/useCalls';
import useDisclosure from 'src/hooks/useDisclosure';
import type { Call, Towing, User } from 'src/types';
import type { updateCallSchema } from 'src/validations/call';
import DriverSelectorModal from '../DriverSelectorModal/DriverSelectorModal';

export type SubmitData = z.infer<typeof updateCallSchema>;

type Props = {
	data: Call;
	drivers: User[];
	towings: Towing[];
};

const CallDispatcher: FC<Props> = ({ data: call, drivers, towings }) => {
	const callActions = useCallActions();

	/**
	 * This state is only used for the `DriverSelectorModal` component
	 * as when we call is `open`, we don't have any info on the status
	 */
	const [status, setStatus] = useState(call.status);
	const disclosure = useDisclosure();

	// Don't show the dispatcher on a completed call
	if (call.status === 'completed') return null;

	const handleSubmit = async (payload: {
		driver?: User;
		towing?: Towing;
		status: Call['status'];
	}) => {
		const driver = payload.driver;
		const towing = payload.towing;

		// Prompt for a Driver and his Towing on certain conditions.
		if (
			(payload.status === 'completed' ||
				payload.status === 'reserved' ||
				payload.status === 'in_progress') &&
			(!driver || !towing)
		) {
			setStatus(payload.status);
			disclosure.open();
			return;
		}

		await callActions.update(call.id, {
			status: payload.status,
			driverId: driver?.id,
			towingId: towing?.id,
		});
		disclosure.close();
	};

	return (
		<>
			<DriverSelectorModal
				isOpen={disclosure.isOpen}
				drivers={drivers}
				towings={towings}
				defaultValues={{
					driverId: call.driverId,
					towingId: call.towingId,
				}}
				onClose={disclosure.close}
				onSelect={(driver, towing) => {
					handleSubmit({ status, driver, towing });
				}}
			/>
			<Stack spacing={2}>
				{(call.status === 'in_progress' || call.status === 'impounded') && (
					<Button
						variant="contained"
						color="primary"
						onClick={() => handleSubmit({ status: 'completed' })}
					>
						Terminer l'appel
					</Button>
				)}

				{(call.status === 'pending' || call.status === 'reserved') && (
					<Button
						variant="outlined"
						color="success"
						onClick={() => handleSubmit({ status: 'in_progress' })}
					>
						Démarrer l'appel
					</Button>
				)}

				{call.status === 'pending' && (
					<Button
						variant="outlined"
						color="warning"
						onClick={() => handleSubmit({ status: 'reserved' })}
					>
						Réserver
					</Button>
				)}

				{call.status === 'in_progress' && (
					<Button
						variant="outlined"
						color="warning"
						onClick={() => handleSubmit({ status: 'impounded' })}
					>
						En fourrière
					</Button>
				)}

				<Button
					variant="outlined"
					color="error"
					disabled={call.status === 'canceled'}
					onClick={() => handleSubmit({ status: 'canceled' })}
				>
					{call.status === 'canceled' ? 'Appel annulé' : 'Annuler'}
				</Button>
			</Stack>
		</>
	);
};

export default CallDispatcher;
