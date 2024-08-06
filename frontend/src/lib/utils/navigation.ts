import { ROUTES } from 'src/lib/constants/routes';

export const isCompanyPath = (pathname: string) =>
	!pathname.startsWith(ROUTES.DashboardPage()) &&
	!pathname.startsWith(ROUTES.ProfilePage()) &&
	!pathname.startsWith(ROUTES.CompaniesPage()) &&
	!pathname.startsWith(ROUTES.SuperAdminsPage());
