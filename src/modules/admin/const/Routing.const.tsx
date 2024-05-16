import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { Locale } from '@shared/utils';

export interface AdminNavigationLink {
	id: string;
	label: string;
	href: string;
	children?: () => AdminNavigationLink[];
}

export const ADMIN_NAVIGATION_LINKS = (locale: Locale): AdminNavigationLink[] => [
	{
		id: 'spaces-admin',
		label: tText('modules/admin/const/routing___bezoekersruimtesbeheer'),
		href: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}`,
		children: ADMIN_SPACES_LINKS,
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
		children: ADMIN_USERS_LINKS,
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

export const ADMIN_SPACES_LINKS = (): AdminNavigationLink[] => [
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

export const CONTENT_PATH = {
	CONTENT_PAGE_OVERVIEW: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}`,
	CONTENT_PAGE_CREATE: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}/${ROUTE_PARTS_BY_LOCALE[locale].create}`,
	CONTENT_PAGE_DETAIL: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}/:id`,
	CONTENT_PAGE_EDIT: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}/:id/${ROUTE_PARTS_BY_LOCALE[locale].edit}`,
	PAGES: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}?content_type=PAGINA`,
	NEWS: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}?content_type=NIEUWS_ITEM`,
	FAQS: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}?content_type=FAQ_ITEM`,
	SCREENCASTS: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}?content_type=SCREENCAST`,
	PROJECTS: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}?content_type=PROJECT`,
	OVERVIEWS: `/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].content}?content_type=OVERZICHT`,
};

export const ADMIN_USERS_LINKS = (): AdminNavigationLink[] => [
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
