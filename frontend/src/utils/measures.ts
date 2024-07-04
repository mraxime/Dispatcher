import type { MeasureType } from 'src/constants/settings';

/**
 * Converts units from "metric" to "imperial" and vice versa.
 */
export const weightConverter = (measure: number, from: MeasureType, to: MeasureType): number => {
	let result = null;
	if (!measure) return measure;
	if (from === to) return measure;

	if (typeof measure !== 'number') throw new Error('"measure" is not a number');
	if (to !== 'imperial' && to !== 'metric') throw new Error('"to" is not "imperial" or "metric"');

	switch (from) {
		case 'metric': {
			// return lbs
			result = measure * 2.2;
			break;
		}
		case 'imperial': {
			// return kg
			result = measure / 2.2;
			break;
		}
		default: {
			throw new Error('"from" is not "imperial" or "metric"');
		}
	}

	return Number(result.toFixed(1));
};

/**
 * Converts units from "metric" to "imperial" and vice versa.
 */
export const measureConverter = (measure: number, from: MeasureType, to: MeasureType): number => {
	let result = null;
	if (!measure) return measure;
	if (from === to) return measure;

	if (typeof measure !== 'number') throw new Error('"measure" is not a number');
	if (to !== 'imperial' && to !== 'metric') throw new Error('"to" is not "imperial" or "metric"');

	switch (from) {
		case 'metric': {
			// return lbs
			result = measure * 3.281;
			break;
		}
		case 'imperial': {
			// return kg
			result = measure / 3.281;
			break;
		}
		default: {
			throw new Error('"from" is not "imperial" or "metric"');
		}
	}

	return Number(result.toFixed(1));
};
