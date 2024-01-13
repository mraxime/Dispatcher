import type { FC } from 'react';
import { Button, Stack } from '@mui/material';
import { FormProvider, useForm, type DefaultValues } from 'react-hook-form';

import { createCallSchema, updateCallSchema } from 'src/lib/schemas/call.schema';
import type { Client, Service, Trailer, User } from 'src/lib/types/directus';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import CallFormAdress from './CallFormAddress';
import CallFormClient from './CallFormClient';
import CallFormDriver from './CallFormDriver';
import CallFormOthers from './CallFormOthers';
import CallFormVehicle from './CallFormVehicle';
import type { CallSubmitData } from './types';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	company: payload?.company ?? undefined,
	name: payload?.name ?? '',
	phone: payload?.phone ?? '',
	status: payload?.status ?? 'PENDING',
	note: payload?.note ?? '',
	driver: payload?.driver ?? null,
	address: payload?.address ?? '',
	service: payload?.service ?? undefined,
	bill_note: payload?.bill_note ?? '',
	destination: payload?.destination ?? '',
	driver_truck: payload?.driver_truck ?? null,
	vehicle: {
		id: payload?.vehicle?.id ?? undefined,
		model: payload?.vehicle?.model ?? '',
		width: payload?.vehicle?.width ?? null,
		height: payload?.vehicle?.height ?? null,
		weight: payload?.vehicle?.weight ?? null,
		lengthh: payload?.vehicle?.lengthh ?? null,
		license: payload?.vehicle?.license ?? '',
		serial_number: payload?.vehicle?.serial_number ?? '',
	},
});

type Props = {
	mode: 'create' | 'update';
	defaultValues?: DefaultValues<CallSubmitData>;
	services?: Service[];
	clients?: Client[];
	drivers?: User[];
	trailers?: Trailer[];
	onSubmit?: (formValues: CallSubmitData) => Promise<void>;
	onCancel?: () => void;
};

const CallForm: FC<Props> = ({
	mode,
	defaultValues,
	services = [],
	clients = [],
	drivers = [],
	trailers = [],
	onSubmit,
	onCancel,
}) => {
	const isNew = mode === 'create';

	const form = useForm<CallSubmitData>({
		resolver: zodResolverEnhanced(isNew ? createCallSchema : updateCallSchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(getInitialValues(formValues));
	});

	return (
		<FormProvider {...form}>
			<form id="call-form" onSubmit={handleFormSubmit} noValidate>
				<Stack spacing={4}>
					<CallFormClient isNew={isNew} services={services} clients={clients} />
					<CallFormAdress />
					<CallFormVehicle />
					<CallFormDriver drivers={drivers} trailers={trailers} />
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
