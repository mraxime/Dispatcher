import type { ComponentType } from 'react';
import LinkIcon from '@mui/icons-material/Link';

import { Icons } from 'src/components/base/Icons';
import type { Permission } from 'src/lib/types/directus';
import { hasPermission } from 'src/lib/utils/permissions';
import { ROUTES } from './routes';

export type NavMenu = Record<string, NavItem[]>;

type NavItem = {
	title: string;
	href: string;
	isExternalHref?: boolean;
	Icon: ComponentType;
	hidden: boolean;
	disabled?: boolean;
	items?: Omit<NavItem, 'items'>[];
};

/**
 * Super Admins navigation menu that should be only visible to super admins.
 */
export const NAV_MENU_ADMIN: NavMenu = {
	Administration: [
		{
			title: 'Entreprises',
			href: ROUTES.CompaniesPage(),
			Icon: Icons.company,
			hidden: false,
		},
		{
			title: 'Super Admins',
			href: ROUTES.SuperAdminsPage(),
			Icon: Icons.user,
			hidden: false,
		},
	],
};

/**
 * Main navigation menu.
 */
export const NAV_MENU = (permissions: Permission[]): NavMenu => ({
	Appels: [
		{
			title: "Formulaires d'appel",
			href: ROUTES.CallsPage(),
			Icon: Icons.call,
			hidden: !hasPermission(permissions, 'READ', 'CALL'),
		},
	],
	Gestion: [
		{
			title: 'Calendrier',
			href: ROUTES.SchedulesPage(),
			Icon: Icons.calendar,
			hidden: false,
		},
		{
			title: 'Employés',
			href: ROUTES.EmployeesPage(),
			Icon: Icons.user,
			hidden: !hasPermission(permissions, 'READ', 'USER'),
		},
		{
			title: 'Remorques',
			href: ROUTES.TrailersPage(),
			Icon: Icons.trailer,
			hidden: !hasPermission(permissions, 'READ', 'TRAILER'),
		},
		{
			title: 'Services',
			href: ROUTES.ServicesPage(),
			Icon: Icons.service,
			hidden: !hasPermission(permissions, 'READ', 'SERVICE'),
		},
	],

	Comptabilité: [
		{
			title: 'Clients',
			href: ROUTES.ClientsPage(),
			Icon: Icons.client,
			hidden: !hasPermission(permissions, 'READ', 'CLIENT'),
		},
		{
			title: 'Factures',
			href: ROUTES.BillsPage(),
			Icon: Icons.bill,
			hidden: !hasPermission(permissions, 'READ', 'BILL'),
		},
		{
			title: 'Tarifs',
			href: ROUTES.PricesPage(),
			Icon: Icons.price,
			hidden: !hasPermission(permissions, 'READ', 'PRICE'),
		},
	],

	Applications: [
		{
			title: 'Discussion',
			href: ROUTES.ChatPage(),
			Icon: Icons.chat,
			hidden: false,
		},
	],

	['Liens rapides']: [
		{
			title: 'Track-RQ',
			href: 'https://track.rq.ms',
			isExternalHref: true,
			Icon: LinkIcon,
			hidden: false,
		},
	],
});
