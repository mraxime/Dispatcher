'use client';

import { type FC, type ReactNode } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fr } from 'date-fns/locale';

type Props = {
	children?: ReactNode;
};

/**
 * Collections of providers to be used at app root layout.
 */
const Providers: FC<Props> = ({ children }) => {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
			{children}
		</LocalizationProvider>
	);
};

export default Providers;
