import type { FC } from 'react';
import { Box, Button, Grid, Stack } from '@mui/material';
import { FormProvider, useForm, type DefaultValues } from 'react-hook-form';

import { createTrailerSchema, updateTrailerSchema } from 'src/lib/schemas/trailer.schema';
import type { Company } from 'src/lib/types/directus';
import { zodResolverEnhanced } from 'src/lib/utils/zod';
import TrailerFormMeasures from './TrailerFormMeasures';
import TrailerFormOther from './TrailerFormOther';
import TrailerFormTruck from './TrailerFormTruck';
import TrailerFormWheels from './TrailerFormWheels';
import type { TrailerSubmitData } from './types';

/**
 * Creates the initial values structure object of the form.
 */
const getInitialValues = (payload?: Props['defaultValues']): Props['defaultValues'] => ({
	company: payload?.company ?? undefined,
	name: payload?.name ?? '',
	in_service: payload?.in_service ?? true,
	brake_type: payload?.brake_type ?? '',
	capacity: payload?.capacity ?? null,
	capacity_back: payload?.capacity_back ?? null,
	capacity_front: payload?.capacity_front ?? null,
	capacity_thaw: payload?.capacity_thaw ?? null,
	radius_front: payload?.radius_front ?? null,
	radius_back: payload?.radius_back ?? null,
	container: payload?.container ?? false,
	gps: payload?.gps ?? false,
	ifta: payload?.ifta ?? false,
	model: payload?.model ?? '',
	nb: payload?.nb ?? null,
	plate_height: payload?.plate_height ?? null,
	plate_length: payload?.plate_length ?? null,
	plate_nb: payload?.plate_nb ?? '',
	serial_nb: payload?.serial_nb ?? '',
	total_height: payload?.total_height ?? null,
	total_length: payload?.total_length ?? null,
	type: payload?.type ?? 'SEMI_HEAVY',
	weight: payload?.weight ?? null,
	wheel_lift: payload?.wheel_lift ?? false,
	note: payload?.note ?? '',
});

type Props = {
	mode: 'create' | 'update';
	companies: Company[];
	defaultValues?: DefaultValues<TrailerSubmitData>;
	onSubmit?: (formValues: TrailerSubmitData) => Promise<void>;
	onCancel?: () => void;
};

const TrailerForm: FC<Props> = ({ mode, companies, defaultValues, onSubmit, onCancel }) => {
	const isNew = mode === 'create';

	const form = useForm<TrailerSubmitData>({
		resolver: zodResolverEnhanced(isNew ? createTrailerSchema : updateTrailerSchema),
		defaultValues: getInitialValues(defaultValues),
	});

	const handleFormSubmit = form.handleSubmit(async (formValues) => {
		if (onSubmit) await onSubmit(formValues);
		form.reset(getInitialValues(formValues));
	});

	return (
		<FormProvider {...form}>
			<form id="trailer-form" noValidate onSubmit={handleFormSubmit}>
				<Grid container spacing={4}>
					<Grid item xs={12} lg={6}>
						<TrailerFormTruck isNew={isNew} companies={companies} />
						<Box mt={4}>
							<TrailerFormWheels />
						</Box>
					</Grid>
					<Grid item xs={12} lg={6}>
						<TrailerFormMeasures />
						<Box mt={4}>
							<TrailerFormOther />
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

export default TrailerForm;
