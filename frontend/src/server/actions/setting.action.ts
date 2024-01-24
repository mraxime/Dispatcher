'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { PaletteMode } from '@mui/material';

import type { MeasureType } from 'src/lib/constants/measures';
import { ROUTES } from 'src/lib/constants/routes';

export const setCompany = async (id: number, pathname: string) => {
	cookies().set('company', String(id), {
		path: '/',
		httpOnly: false,
		maxAge: 34560000, // 400 days (maximum)
	});

	/**
	 * Little hack to adresss issues that occurs when switching companies.
	 * When user switches company on specific pages, data fetching errors may occur.
	 * Thats because the data may not be accessible under the scope of the new company.
	 */
	[
		ROUTES.UsersPage(),
		ROUTES.CallsPage(),
		ROUTES.TrailersPage(),
		ROUTES.ServicesPage(),
		ROUTES.ClientsPage(),
		ROUTES.BillsPage(),
		ROUTES.PricesPage(),
	].forEach((route) => {
		if (pathname.startsWith(route + '/')) throw redirect(route);
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
