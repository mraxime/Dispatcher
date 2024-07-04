import {
	Divider,
	IconButton,
	InputAdornment,
	Stack,
	SvgIcon,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Icons } from 'src/components/base/Icons';
import { PRICE_CONDITION_TYPES_MAP, type PriceConditionType } from 'src/constants/price-condition';
import type { PriceCondition, PriceInput } from 'src/types';

const conditionInitialData: Partial<PriceCondition> = {
	type: 'service_duration',
	min: null,
	max: null,
};

const PriceFormConditions = () => {
	const form = useFormContext<PriceInput>();

	const conditions = useFieldArray({
		name: 'conditions',
		control: form.control,
	});

	const addNewCondition = () => {
		conditions.append(conditionInitialData);
	};

	const changeConditionType = (index: number, value: PriceConditionType) => {
		conditions.update(index, { ...conditionInitialData, type: value });
		form.trigger(`conditions.${index}`).catch(console.log);
	};

	return (
		<Stack spacing={4}>
			{conditions.fields.map((condition, index) => (
				<div key={condition.id}>
					{index > 0 && (
						<Divider sx={{ mb: 4 }}>
							<Typography variant="caption" color="inherit">
								Condition {index + 1}
							</Typography>
						</Divider>
					)}

					<Stack direction="row" alignItems="start" spacing={3}>
						<Controller
							name={`conditions.${index}.type`}
							control={form.control}
							render={({ field, fieldState }) => (
								<TextField
									label="Type de condition"
									type="text"
									select
									SelectProps={{ native: true }}
									variant="filled"
									fullWidth
									{...field}
									onChange={(e) => changeConditionType(index, e.target.value as PriceConditionType)}
									error={Boolean(fieldState.error)}
									helperText={fieldState.error?.message}
								>
									{Object.values(PRICE_CONDITION_TYPES_MAP).map((option) => (
										<option key={option.value} value={option.value}>
											{option.title}
										</option>
									))}
								</TextField>
							)}
						/>

						<Controller
							name={`conditions.${index}.min`}
							control={form.control}
							render={({ field, fieldState }) => (
								<TextField
									label={PRICE_CONDITION_TYPES_MAP[condition.type].minLabel}
									type="number"
									fullWidth
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												{PRICE_CONDITION_TYPES_MAP[condition.type].adornmentLabel}
											</InputAdornment>
										),
										...field,
										onChange: (e) => {
											field.onChange(e);
											form.trigger(`conditions.${index}.type`).catch(console.log);
										},
									}}
									error={Boolean(fieldState.error)}
									helperText={fieldState.error?.message}
								/>
							)}
						/>

						<Controller
							name={`conditions.${index}.max`}
							control={form.control}
							render={({ field, fieldState }) => (
								<TextField
									label={PRICE_CONDITION_TYPES_MAP[condition.type].maxLabel}
									type="number"
									fullWidth
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												{PRICE_CONDITION_TYPES_MAP[condition.type].adornmentLabel}
											</InputAdornment>
										),
										...field,
										onChange: (e) => {
											field.onChange(e);
											form.trigger(`conditions.${index}.type`).catch(console.log);
										},
									}}
									error={Boolean(fieldState.error)}
									helperText={fieldState.error?.message}
								/>
							)}
						/>

						<Tooltip title="Retirer" sx={{ alignSelf: 'center' }}>
							<IconButton color="error" size="small" onClick={() => conditions.remove(index)}>
								<SvgIcon color="inherit" fontSize="inherit">
									<Icons.close />
								</SvgIcon>
							</IconButton>
						</Tooltip>
					</Stack>
				</div>
			))}
			<Tooltip title="Ajouter une condition">
				<IconButton
					disabled={Boolean(form.formState.errors.conditions)}
					style={{ alignSelf: 'start' }}
					onClick={addNewCondition}
				>
					<Icons.add />
				</IconButton>
			</Tooltip>
		</Stack>
	);
};

export default PriceFormConditions;
