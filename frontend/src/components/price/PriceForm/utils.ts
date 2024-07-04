import type { PriceCondition } from 'src/types';

/**
 * Helper function to create an easy to understand text description from
 * a `PriceCondition` object.
 */
export const generatePriceConditionDesc = (condition: PriceCondition): string => {
	if (condition.type === 'service_distance') {
		if (!condition.min && !condition.max) return '';

		if (!condition.min) {
			return `Doit être un déplacement maximale de ${condition.max}km.`;
		}

		if (!condition.max) {
			return `Doit être un déplacement minimale de ${condition.min}km.`;
		}

		return `Doit être un déplacement entre ${condition.min}km et ${condition.max}km.`;
	}

	if (condition.type === 'service_duration') {
		if (!condition.min && !condition.max) return '';

		if (!condition.min) {
			return `Doit être d'une durée maximale de ${condition.max}h.`;
		}

		if (!condition.max) {
			return `Doit être d'une durée minimale de ${condition.min}h.`;
		}

		return `Doit être d'une durée entre ${condition.min}h et ${condition.max}h.`;
	}

	if (condition.type === 'day_time') {
		if (!condition.min && !condition.max) return '';

		if (!condition.min) {
			return `Doit être effectué après ${condition.max}h.`;
		}

		if (!condition.max) {
			return `Doit être effectué avant après ${condition.min}h.`;
		}

		return `Doit être effectué entre ${condition.min}h et ${condition.max}h.`;
	}

	return '';
};
