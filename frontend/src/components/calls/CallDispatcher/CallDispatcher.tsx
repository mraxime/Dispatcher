import { useState, type FC } from 'react';
import { Button, Stack } from '@mui/material';
import type { z } from 'zod';

import useDisclosure from 'src/hooks/useDisclosure';
import type { updateCallSchema } from 'src/lib/schemas/call.schema';
import type { Call, Trailer, User } from 'src/lib/types/directus';
import { isObject } from 'src/lib/utils';
import DriverSelectorModal from '../DriverSelectorModal/DriverSelectorModal';

export type SubmitData = z.infer<typeof updateCallSchema>;

type Props = {
	data: Call;
	drivers: User[];
	trailers: Trailer[];
	onSubmit?: (data: { status: Call['status']; driver?: User; trailer?: Trailer }) => void;
};

const CallDispatcher: FC<Props> = ({ data: call, drivers, trailers, onSubmit }) => {
	/**
	 * This state is only used for the `DriverSelectorModal` component
	 * as when we call is `open`, we don't have any info on the status
	 */
	const [status, setStatus] = useState(call.status);
	const disclosure = useDisclosure();

	// Don't show the dispatcher on a completed call
	if (call.status === 'COMPLETED') return null;

	const handleSubmit = (payload: { driver?: User; trailer?: Trailer; status: Call['status'] }) => {
		const driver = payload.driver;
		const trailer = payload.trailer;

		// Prompt for a Driver and his Trailer on certain conditions.
		if (
			(payload.status === 'COMPLETED' ||
				payload.status === 'RESERVED' ||
				payload.status === 'IN_PROGRESS') &&
			(!driver || !trailer)
		) {
			setStatus(payload.status);
			disclosure.open();
			return;
		}

		if (onSubmit) onSubmit({ status: payload.status, driver, trailer });
		disclosure.close();
	};

	return (
		<>
			<DriverSelectorModal
				isOpen={disclosure.isOpen}
				drivers={drivers}
				trailers={trailers}
				defaultValues={{
					driver: isObject(call.driver) ? call.driver.id : call.driver ?? null,
					trailer: isObject(call.driver_truck) ? call.driver_truck.id : call.driver_truck ?? null,
				}}
				onClose={disclosure.close}
				onSelect={(driver, trailer) => {
					handleSubmit({ status, driver, trailer });
				}}
			/>
			<Stack spacing={2}>
				{(call.status === 'IN_PROGRESS' || call.status === 'IMPOUNDED') && (
					<Button
						variant="contained"
						color="primary"
						onClick={() => handleSubmit({ status: 'COMPLETED' })}
					>
						Terminer l'appel
					</Button>
				)}

				{(call.status === 'PENDING' || call.status === 'RESERVED') && (
					<Button
						variant="outlined"
						color="success"
						onClick={() => handleSubmit({ status: 'IN_PROGRESS' })}
					>
						Démarrer l'appel
					</Button>
				)}

				{call.status === 'PENDING' && (
					<Button
						variant="outlined"
						color="warning"
						onClick={() => handleSubmit({ status: 'RESERVED' })}
					>
						Réserver
					</Button>
				)}

				{call.status === 'IN_PROGRESS' && (
					<Button
						variant="outlined"
						color="warning"
						onClick={() => handleSubmit({ status: 'IMPOUNDED' })}
					>
						En fourrière
					</Button>
				)}

				<Button
					variant="outlined"
					color="error"
					disabled={call.status === 'CANCELED'}
					onClick={() => handleSubmit({ status: 'CANCELED' })}
				>
					{call.status === 'CANCELED' ? 'Appel annulé' : 'Annuler'}
				</Button>
			</Stack>
		</>
	);
};

export default CallDispatcher;
