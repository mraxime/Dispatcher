'use client';

import type { FC } from 'react';
import { Box, Button, Grid, Stack } from '@mui/material';
import { FormProvider, useForm, type DefaultValues } from 'react-hook-form';
import { useTowingActions } from 'src/hooks/useTowings';
import type { Company, Towing, TowingInput } from 'src/types';
import { zodResolverEnhanced } from 'src/utils/zod';
import { createTowingSchema, updateTowingSchema } from 'src/validations/towing';
import TowingFormMeasures from './TowingFormMeasures';
import TowingFormOther from './TowingFormOther';
import TowingFormTruck from './TowingFormTruck';
import TowingFormWheels from './TowingFormWheels';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	companyId: payload?.companyId ?? undefined,
	name: payload?.name ?? '',
	status: payload?.status ?? 'active',
	driverId: payload?.driverId ?? null,
	brakeType: payload?.brakeType ?? '',
	capacity: payload?.capacity ?? null,
	capacityBack: payload?.capacityBack ?? null,
	capacityFront: payload?.capacityFront ?? null,
	capacityThaw: payload?.capacityThaw ?? null,
	radiusFront: payload?.radiusFront ?? null,
	radiusBack: payload?.radiusBack ?? null,
	container: payload?.container ?? false,
	gps: payload?.gps ?? false,
	ifta: payload?.ifta ?? false,
	model: payload?.model ?? '',
	wheelCount: payload?.wheelCount ?? null,
	plateHeight: payload?.plateHeight ?? null,
	plateLength: payload?.plateLength ?? null,
	plateNb: payload?.plateNb ?? '',
	serialNb: payload?.serialNb ?? '',
	totalHeight: payload?.totalHeight ?? null,
	totalLength: payload?.totalLength ?? null,
	type: payload?.type ?? 'semi_heavy',
	weight: payload?.weight ?? null,
	wheelLift: payload?.wheelLift ?? false,
	note: payload?.note ?? '',
});

type Props = {
	id?: Towing['id'];
	companies: Company[];
	defaultValues?: DefaultValues<TowingInput>;
	onSuccess?: () => void;
	onCancel?: () => void;
};

const TowingForm: FC<Props> = ({ id, companies, defaultValues, onSuccess, onCancel }) => {
	const isNew = !id;
	const towingActions = useTowingActions();

	const form = useForm<TowingInput>({
		resolver: zodResolverEnhanced(isNew ? createTowingSchema : updateTowingSchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		isNew ? await towingActions.create(formValues) : await towingActions.update(id, formValues);
		form.reset(getInitialValues(formValues));
		onSuccess?.();
	});

	return (
		<FormProvider {...form}>
			<form id="towing-form" noValidate onSubmit={handleFormSubmit}>
				<Grid container spacing={4}>
					<Grid item xs={12} lg={6}>
						<TowingFormTruck isNew={isNew} companies={companies} />
						<Box mt={4}>
							<TowingFormWheels />
						</Box>
					</Grid>
					<Grid item xs={12} lg={6}>
						<TowingFormMeasures />
						<Box mt={4}>
							<TowingFormOther />
						</Box>
					</Grid>
				</Grid>

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

export default TowingForm;
