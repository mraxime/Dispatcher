/**
 * App router paths.
 */
export const ROUTES = {
	ErrorPage: () => '/404',
	LoginPage: () => '/connexion',
	DashboardPage: () => '/dashboard/horaire',
	ProfilePage: () => '/dashboard/profil',

	// Bills
	//////////////////////////////////////////////////////////
	BillsPage: () => '/dashboard/factures',
	BillPage: (id: string) => `/dashboard/factures/${id}`,
	EditBillPage: (id: string) => `/dashboard/factures/${id}/modifier`,
	NewBillPage: () => '/dashboard/factures/ajouter',

	// Calendars
	//////////////////////////////////////////////////////////
	CalendarsPage: () => '/dashboard/horaire',
	CalendarPage: (id: string) => `/dashboard/horaire/${id}`,
	EditCalendarPage: (id: string) => `/dashboard/horaire/${id}/modifier`,

	// Calls
	//////////////////////////////////////////////////////////
	CallsPage: () => '/dashboard/appels',
	CallPage: (id: string) => `/dashboard/appels/${id}`,
	EditCallPage: (id: string) => `/dashboard/appels/${id}/modifier`,
	NewCallPage: () => '/dashboard/appels/ajouter',

	// Clients
	//////////////////////////////////////////////////////////
	ClientsPage: () => '/dashboard/clients',
	ClientPage: (id: string) => `/dashboard/clients/${id}`,
	EditClientPage: (id: string) => `/dashboard/clients/${id}/modifier`,
	NewClientPage: () => '/dashboard/clients/ajouter',

	// Companies
	//////////////////////////////////////////////////////////
	CompaniesPage: () => '/dashboard/entreprises',
	CompanyPage: (id: string) => `/dashboard/entreprises/${id}`,
	EditCompanyPage: (id: string) => `/dashboard/entreprises/${id}/modifier`,
	NewCompanyPage: () => `/dashboard/entreprises/ajouter`,

	// Messages
	//////////////////////////////////////////////////////////
	MessagesPage: () => '/dashboard/discussion',

	// Prices
	//////////////////////////////////////////////////////////
	PricesPage: () => '/dashboard/prix',
	PricePage: (id: string) => `/dashboard/prix/${id}`,
	EditPricePage: (id: string) => `/dashboard/prix/${id}/modifier`,
	NewPricePage: () => '/dashboard/prix/ajouter',

	// Services
	//////////////////////////////////////////////////////////
	ServicesPage: () => '/dashboard/services',
	ServicePage: (id: string) => `/dashboard/services/${id}`,
	EditServicePage: (id: string) => `/dashboard/services/${id}/modifier`,
	NewServicePage: () => '/dashboard/services/ajouter',

	// Towings
	//////////////////////////////////////////////////////////
	TowingsPage: () => '/dashboard/remorques',
	TowingPage: (id: string) => `/dashboard/remorques/${id}`,
	EditTowingPage: (id: string) => `/dashboard/remorques/${id}/modifier`,
	NewTowingPage: () => '/dashboard/remorques/ajouter',

	// Users
	//////////////////////////////////////////////////////////
	UsersPage: () => '/dashboard/utilisateurs',
	UserPage: (id: string) => `/dashboard/utilisateurs/${id}`,
	EditUserPage: (id: string) => `/dashboard/utilisateurs/${id}/modifier`,
	NewUserPage: () => '/dashboard/utilisateurs/ajouter',
};
