import { ROUTE_PARTS } from '@shared/const/routes';
import { tText } from '@shared/helpers/translate';

export interface AdminNavigationLink {
	id: string;
	label: string;
	href: string;
	children?: () => AdminNavigationLink[];
}

export const ADMIN_NAVIGATION_LINKS = (): AdminNavigationLink[] => [
	{
		id: 'spaces-admin',
		label: tText('modules/admin/const/routing___bezoekersruimtesbeheer'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitorSpaces}`,
		children: ADMIN_SPACES_LINKS,
	},
	{
		id: 'content-pages-admin',
		label: tText('modules/admin/const/routing___content-paginas'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
	},
	{
		id: 'navigation-admin',
		label: tText('modules/admin/const/routing___navigatie'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}`,
	},
	{
		id: 'translations-v2-admin',
		label: tText('modules/admin/const/routing___vertalingen-v-2'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
	},
	{
		id: 'users-admin',
		label: tText('modules/admin/const/routing___gebruikersbeheer'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userManagement}/${ROUTE_PARTS.users}`,
		children: ADMIN_USERS_LINKS,
	},
	{
		id: 'material-requests',
		label: tText('modules/admin/const/routing___materiaalaanvragen'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.materialRequests}`,
	},
	{
		id: 'alerts',
		label: tText('modules/admin/const/routing___meldingen'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.alerts}`,
	},
];

export const ADMIN_SPACES_LINKS = (): AdminNavigationLink[] => [
	{
		id: 'spaces',
		label: tText('modules/admin/const/routing___alle-bezoekersruimtes'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitorSpaces}`,
	},
	{
		id: 'requests',
		label: tText('modules/admin/const/routing___aanvragen'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitRequests}`,
	},
	{
		id: 'visitors',
		label: tText('modules/admin/const/routing___actieve-bezoekers'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.activeVisitors}`,
	},
];

export const CONTENT_PATH = {
	CONTENT_PAGE_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
	CONTENT_PAGE_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/${ROUTE_PARTS.create}`,
	CONTENT_PAGE_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id`,
	CONTENT_PAGE_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id/${ROUTE_PARTS.edit}`,
	PAGES: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PAGINA`,
	NEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=NIEUWS_ITEM`,
	FAQS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=FAQ_ITEM`,
	SCREENCASTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=SCREENCAST`,
	PROJECTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PROJECT`,
	OVERVIEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=OVERZICHT`,
};

export const ADMIN_USERS_LINKS = (): AdminNavigationLink[] => [
	{
		id: 'users',
		label: tText('modules/admin/const/routing___gebruikers'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userManagement}/${ROUTE_PARTS.users}`,
	},
	{
		id: 'permissions',
		label: tText('modules/admin/const/routing___groepen-en-permissies'),
		href: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userManagement}/${ROUTE_PARTS.permissions}`,
	},
];
