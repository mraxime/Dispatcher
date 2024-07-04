'use client';

import type { FC, ReactNode } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';
import { fr } from 'date-fns/locale';

type Props = {
	children: ReactNode;
};

export const LocalizationProvider: FC<Props> = ({ children }) => {
	return (
		<Provider dateAdapter={AdapterDateFns} adapterLocale={fr}>
			{children}
		</Provider>
	);
};
