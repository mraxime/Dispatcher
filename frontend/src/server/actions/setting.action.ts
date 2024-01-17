'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { PaletteMode } from '@mui/material';

import type { MeasureType } from 'src/lib/constants/measures';
import { ROUTES } from 'src/lib/constants/routes';
import { isCompanyPath } from 'src/lib/utils/navigation';

export const setCompany = async (id: number | null, pathname: string) => {
	if (id) {
		cookies().set('company', String(id), {
			path: '/',
			httpOnly: false,
			maxAge: 34560000, // 400 days
		});
	} else {
		cookies().delete('company');
		if (isCompanyPath(pathname)) redirect(ROUTES.DashboardPage());
	}
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
