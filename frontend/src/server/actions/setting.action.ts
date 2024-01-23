'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { PaletteMode } from '@mui/material';

import type { MeasureType } from 'src/lib/constants/measures';

export const setCompany = async (id: number) => {
	cookies().set('company', String(id), {
		path: '/',
		httpOnly: false,
		maxAge: 34560000, // 400 days (maximum)
	});
	revalidatePath('/', 'layout');
};

export const setTheme = (mode: PaletteMode) => {
	cookies().set('theme', mode, {
		path: '/',
		httpOnly: false,
		maxAge: 34560000, // 400 days (maximum)
	});
	revalidatePath('/', 'layout');
};

export const setMeasure = (measure: MeasureType) => {
	cookies().set('measure-type', measure, {
		path: '/',
		httpOnly: false,
		maxAge: 34560000, // 400 days (maximum)
	});
	revalidatePath('/', 'layout');
};
