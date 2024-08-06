'use client';

import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type Dispatch,
	type FC,
	type ReactNode,
	type SetStateAction,
} from 'react';
import Cookies from 'js-cookie';

import { useCompany } from 'src/hooks/useCompanies';
import type { Company } from 'src/lib/types/directus';

type SelectedCompany = Company | null;

type ContextValue = {
	current: SelectedCompany;
	setCurrent: Dispatch<SetStateAction<number | null>>;
};

const Context = createContext<ContextValue>(undefined!);

export const useCurrentCompany = () => {
	const contextValue = useContext(Context);
	if (contextValue === undefined) {
		throw new Error('useCompanyContext must be within CompanyProvider');
	}
	return contextValue;
};

type Props = {
	children: ReactNode;
};

export const CurrentCompanyProvider: FC<Props> = ({ children }) => {
	const [currentId, setCurrentId] = useState(Number(Cookies.get('current-company')) || null);
	const company = useCompany(currentId);

	useEffect(() => {
		if (currentId) Cookies.set('current-company', currentId);
		else Cookies.remove('current-company');
	}, [currentId]);

	const contextValue = useMemo(
		() => ({ current: company.data ?? null, setCurrent: setCurrentId }),
		[company],
	);

	return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
