import { createContext, useContext, useEffect, type FC, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import PageLoading from 'src/components/base/PageLoading';
import { useOptionalSession } from 'src/hooks/useSession';
import { ROUTES } from 'src/lib/constants/routes';

type Session = ReturnType<typeof useOptionalSession>;

type ContextValue = {
	data: Exclude<Session['data'], undefined>;
	logout: Session['logout'];
	update: Session['update'];
	revalidate: Session['revalidate'];
};

const Context = createContext<ContextValue>(undefined!);

/**
 * Provides the current authentificated user session object.
 * The provider of this hook guarantee that the session exist.
 * If it's not found, then user gets redirected to Login page.
 */
export const useSession = () => {
	const contextValue = useContext(Context);
	if (contextValue === undefined) {
		throw new Error('useSessionContext must be within SessionProvider');
	}
	return contextValue;
};

type Props = {
	children: ReactNode;
};

/**
 * Enforce children to be rendered only if user session is found (authentificated).
 * If not, user gets redirected to Login page.
 */
export const SessionProvider: FC<Props> = ({ children }) => {
	const router = useRouter();
	const session = useOptionalSession();

	// Redirect to Login page if not auth
	useEffect(() => {
		if (!session.isLoading && !session.data) {
			router.push(ROUTES.LoginPage());
		}
	}, [session.isLoading, session.data]);

	if (!session.data) {
		return <PageLoading />;
	}

	return (
		<Context.Provider
			value={{
				data: session.data,
				logout: session.logout,
				update: session.update,
				revalidate: session.revalidate,
			}}
		>
			{children}
		</Context.Provider>
	);
};
