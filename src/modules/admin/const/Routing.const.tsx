import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { Locale } from '@shared/utils';

export interface AdminNavigationLink {
	id: string;
	label: string;
	href: string;
	children?: (locale: Locale) => AdminNavigationLink[];
}

export const ADMIN_NAVIGATION_LINKS = (locale: Locale): AdminNavigationLink[] => [
	{
		id: 'spaces-admin',
		label: tText('modules/admin/const/routing___bezoekersruimtesbeheer'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}`,
		children: GET_ADMIN_SPACES_LINKS,
	},
	{
		id: 'content-pages-admin',
		label: tText('modules/admin/const/routing___content-paginas'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}`,
	},
	{
		id: 'content-page-labels-admin',
		label: tText('modules/admin/const/routing___content-pagina-labels'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].contentPageLabels}`,
	},
	{
		id: 'navigation-admin',
		label: tText('modules/admin/const/routing___navigatie'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].navigation}`,
	},
	{
		id: 'translations-admin',
		label: tText('modules/admin/const/routing___vertalingen'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].translations}`,
	},
	{
		id: 'users-admin',
		label: tText('modules/admin/const/routing___gebruikersbeheer'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].userManagement}/${ROUTE_PARTS_BY_LOCALE[locale].users}`,
		children: GET_ADMIN_USERS_LINKS,
	},
	{
		id: 'material-requests',
		label: tText('modules/admin/const/routing___materiaalaanvragen'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].materialRequests}`,
	},
	{
		id: 'alerts',
		label: tText('modules/admin/const/routing___meldingen'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].alerts}`,
	},
];

export const GET_ADMIN_SPACES_LINKS = (locale: Locale): AdminNavigationLink[] => [
	{
		id: 'spaces',
		label: tText('modules/admin/const/routing___alle-bezoekersruimtes'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}`,
	},
	{
		id: 'requests',
		label: tText('modules/admin/const/routing___aanvragen'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitRequests}`,
	},
	{
		id: 'visitors',
		label: tText('modules/admin/const/routing___actieve-bezoekers'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].activeVisitors}`,
	},
];

export const GET_ADMIN_USERS_LINKS = (locale: Locale): AdminNavigationLink[] => [
	{
		id: 'users',
		label: tText('modules/admin/const/routing___gebruikers'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].userManagement}/${ROUTE_PARTS_BY_LOCALE[locale].users}`,
	},
	{
		id: 'permissions',
		label: tText('modules/admin/const/routing___groepen-en-permissies'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].userManagement}/${ROUTE_PARTS_BY_LOCALE[locale].permissions}`,
	},
];
