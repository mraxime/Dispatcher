'use client';

import type { FC } from 'react';
import { Button, Stack } from '@mui/material';
import { FormProvider, useForm, type DefaultValues } from 'react-hook-form';
import { useCallActions } from 'src/hooks/useCalls';
import type { Call, CallInput, Client, Service, Towing, User } from 'src/types';
import { zodResolverEnhanced } from 'src/utils/zod';
import { createCallSchema, updateCallSchema } from 'src/validations/call';
import CallFormAdress from './CallFormAddress';
import CallFormClient from './CallFormClient';
import CallFormDriver from './CallFormDriver';
import CallFormOthers from './CallFormOthers';
import CallFormVehicle from './CallFormVehicle';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	companyId: payload?.companyId ?? undefined,
	status: payload?.status ?? 'pending',
	origin: payload?.origin ?? '',
	checkpoint: payload?.checkpoint ?? '',
	destination: payload?.destination ?? '',
	serviceId: payload?.serviceId ?? '',
	clientId: payload?.clientId ?? '',
	vehicleId: payload?.vehicleId ?? '',
	towingId: payload?.towingId ?? '',
	driverId: payload?.driverId ?? '',
	note: payload?.note ?? '',
	billNote: payload?.billNote ?? '',
	client: {
		status: payload?.client?.status ?? 'active',
		email: payload?.client?.email ?? '',
		phone: payload?.client?.phone ?? '',
		firstName: payload?.client?.firstName ?? '',
		lastName: payload?.client?.lastName ?? '',
		companyName: payload?.client?.companyName ?? '',
	},
	vehicle: {
		model: payload?.vehicle?.model ?? '',
		license: payload?.vehicle?.license ?? '',
		serialNb: payload?.vehicle?.serialNb ?? '',
		length: payload?.vehicle?.length ?? '',
		width: payload?.vehicle?.width ?? '',
		height: payload?.vehicle?.height ?? '',
		weight: payload?.vehicle?.weight ?? '',
	},
});

type Props = {
	id?: Call['id'];
	defaultValues?: DefaultValues<CallInput>;
	services?: Service[];
	clients?: Client[];
	drivers?: User[];
	towings?: Towing[];
	onSuccess?: () => void;
	onCancel?: () => void;
};

const CallForm: FC<Props> = ({
	id,
	defaultValues,
	services = [],
	clients = [],
	drivers = [],
	towings = [],
	onSuccess,
	onCancel,
}) => {
	const isNew = !id;
	const callActions = useCallActions();

	const form = useForm<CallInput>({
		resolver: zodResolverEnhanced(isNew ? createCallSchema : updateCallSchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		isNew ? await callActions.create(formValues) : await callActions.update(id, formValues);
		form.reset(getInitialValues(formValues));
		onSuccess?.();
	});

	return (
		<FormProvider {...form}>
			<form id="call-form" onSubmit={handleFormSubmit} noValidate>
				<Stack spacing={4}>
					<CallFormDriver services={services} drivers={drivers} towings={towings} />
					<CallFormAdress />
					<CallFormClient clients={clients} />
					<CallFormVehicle />
					<CallFormOthers />
				</Stack>

				<Stack mt={4} direction="row" spacing={2} justifyContent="end">
					{onCancel && (
						<Button color="inherit" onClick={onCancel}>
							Annuler
						</Button>
					)}
					<Button
						type="submit"
						variant="contained"
						disabled={form.formState.isSubmitting || !form.formState.isDirty}
					>
						Enregistrer
					</Button>
				</Stack>
			</form>
		</FormProvider>
	);
};

export default CallForm;
