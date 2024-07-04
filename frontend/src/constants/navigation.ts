import type { ComponentType } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import { Icons } from 'src/components/base/Icons';
import type { PermissionKey } from 'src/constants/user';
import { ROUTES } from './routes';

export type NavMenu = Record<string, NavItem[]>;

export type NavItem = {
	title: string;
	href: string;
	isExternalHref?: boolean;
	Icon: ComponentType;
	permission?: PermissionKey;
	hidden?: boolean;
	items?: Omit<NavItem, 'items'>[];
};

/**
 * Main navigation menu.
 * TODO: Replace `hidden` with `permission` with the permission_key directly
 */
export const NAV_MENU: NavMenu = {
	Dispatch: [
		{
			title: 'Horaire',
			href: ROUTES.CalendarsPage(),
			Icon: Icons.calendar,
			permission: 'calendars:read',
		},
		{
			title: 'Appels',
			href: ROUTES.CallsPage(),
			Icon: Icons.call,
			permission: 'calls:read',
		},
	],
	Gestion: [
		{
			title: 'Entreprises',
			href: ROUTES.CompaniesPage(),
			Icon: Icons.company,
			permission: 'companies:read',
		},
		{
			title: 'Utilisateurs',
			href: ROUTES.UsersPage(),
			Icon: Icons.user,
			permission: 'users:read',
		},
		{
			title: 'Clients',
			href: ROUTES.ClientsPage(),
			Icon: Icons.client,
			permission: 'clients:read',
		},
		{
			title: 'Remorques',
			href: ROUTES.TowingsPage(),
			Icon: Icons.towing,
			permission: 'towings:read',
		},
		{
			title: 'Services',
			href: ROUTES.ServicesPage(),
			Icon: Icons.service,
			permission: 'services:read',
		},
	],

	Comptabilité: [
		{
			title: 'Factures',
			href: ROUTES.BillsPage(),
			Icon: Icons.bill,
			permission: 'bills:read',
		},
		{
			title: 'Prix',
			href: ROUTES.PricesPage(),
			Icon: Icons.price,
			permission: 'prices:read',
		},
	],

	Applications: [
		{
			title: 'Discussion',
			href: ROUTES.MessagesPage(),
			Icon: Icons.chat,
			hidden: true,
		},
	],
};
