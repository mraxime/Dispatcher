import { PRICE_TYPES_MAP, type PriceType } from 'src/constants/price';

const FORMATTER = new Intl.NumberFormat('fr-CA', {
	style: 'currency',
	currency: 'CAD',
});

// Quebec taxes 2022: TVQ 9.975% | TPS 5%
const TVQ = 0.09975; // 9.975%
const TPS = 0.05; // 5%

export const getTVQ = (num: number) => num * TVQ;

export const getTPS = (num: number) => num * TPS;

export const getTaxAmount = (num: number) => getTVQ(num) + getTPS(num);

export const getPriceCurrency = (priceType: PriceType): string => {
	return '$' + (PRICE_TYPES_MAP[priceType].adornment ?? '');
};

export const toCurrency = (number = 0, options?: { priceType?: PriceType }): string => {
	const value = FORMATTER.format(number);

	if (options?.priceType) {
		return value + PRICE_TYPES_MAP[options.priceType].adornment;
	}

	return value;
};
