/**
 * App router paths.
 */
export const ROUTES = {
	ErrorPage: () => '/404',
	SignUpPage: () => '/inscription',
	LoginPage: () => '/connexion',
	DashboardPage: () => '/dashboard/profil',
	ProfilePage: () => '/dashboard/profil',

	// COMPANIES
	// =======================================================================
	CompaniesPage: () => '/dashboard/entreprises',
	CompanyPage: (id: number) => `/dashboard/entreprises/${id}`,
	EditCompanyPage: (id: number) => `/dashboard/entreprises/${id}/modifier`,
	NewCompanyPage: () => `/dashboard/entreprises/ajouter`,

	// SUPER_ADMINS
	// =======================================================================
	SuperAdminsPage: () => '/dashboard/super-admins',
	SuperAdminPage: (id: string) => `/dashboard/super-admins/${id}`,
	EditSuperAdminPage: (id: string) => `/dashboard/super-admins/${id}/modifier`,
	NewSuperAdminPage: () => '/dashboard/super-admins/ajouter',

	// EMPLOYEES
	// =======================================================================
	EmployeesPage: () => '/dashboard/employes',
	EmployeePage: (id: string) => `/dashboard/employes/${id}`,
	EditEmployeePage: (id: string) => `/dashboard/employes/${id}/modifier`,
	NewEmployeePage: () => '/dashboard/employes/ajouter',

	// TRAILERS
	// =======================================================================
	TrailersPage: () => '/dashboard/remorques',
	TrailerPage: (id: number) => `/dashboard/remorques/${id}`,
	EditTrailerPage: (id: number) => `/dashboard/remorques/${id}/modifier`,
	NewTrailerPage: () => '/dashboard/remorques/ajouter',

	// SCHEDULES
	// =======================================================================
	SchedulesPage: () => '/dashboard/horaires',
	SchedulePage: (id: number) => `/dashboard/horaires/${id}`,
	EditSchedulePage: (id: number) => `/dashboard/horaires/${id}/modifier`,

	// PRICES
	// =======================================================================
	PricesPage: () => '/dashboard/prix',
	PricePage: (id: number) => `/dashboard/prix/${id}`,
	EditPricePage: (id: number) => `/dashboard/prix/${id}/modifier`,
	NewPricePage: () => '/dashboard/prix/ajouter',

	// BILLS
	// =======================================================================
	BillsPage: () => '/dashboard/factures',
	BillPage: (id: number) => `/dashboard/factures/${id}`,
	EditBillPage: (id: number) => `/dashboard/factures/${id}/modifier`,
	NewBillPage: () => '/dashboard/factures/ajouter',

	// CALLS
	// =======================================================================
	CallsPage: () => '/dashboard/appels',
	CallPage: (id: number) => `/dashboard/appels/${id}`,
	EditCallPage: (id: number) => `/dashboard/appels/${id}/modifier`,
	NewCallPage: () => '/dashboard/appels/ajouter',

	// CLIENT ACCOUNTS
	// =======================================================================
	ClientsPage: () => '/dashboard/clients',
	ClientPage: (id: number) => `/dashboard/clients/${id}`,
	EditClientPage: (id: number) => `/dashboard/clients/${id}/modifier`,
	NewClientPage: () => '/dashboard/clients/ajouter',

	// CHAT
	// =======================================================================
	ChatPage: () => '/dashboard/discussion',

	// SERVICES
	// =======================================================================
	ServicesPage: () => '/dashboard/services',
	ServicePage: (id: number) => `/dashboard/services/${id}`,
	EditServicePage: (id: number) => `/dashboard/services/${id}/modifier`,
	NewServicePage: () => '/dashboard/services/ajouter',
};
