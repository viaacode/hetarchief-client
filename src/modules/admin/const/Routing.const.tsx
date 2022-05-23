import { ROUTE_PARTS } from '@shared/const/routes';
import { i18n } from '@shared/helpers/i18n';

export interface AdminNavigationLink {
	id: string;
	label: string;
	href: string;
	children?: () => AdminNavigationLink[];
}

export const ADMIN_NAVIGATION_LINKS = (): AdminNavigationLink[] => [
	{
		id: 'spaces-admin',
		label: i18n.t('modules/admin/const/routing___leeszalenbeheer'),
		href: '',
		children: ADMIN_SPACES_LINKS,
	},
	{
		id: 'content-pages-admin',
		label: i18n.t('modules/admin/const/routing___content-paginas'),
		href: '/admin/content',
	},
	{
		id: 'navigation-admin',
		label: i18n.t('Navigatie'),
		href: '/admin/navigatie',
	},
	{
		id: 'translations-admin',
		label: i18n.t('modules/admin/const/routing___translations'),
		href: '/admin/vertalingen',
	},
	{
		id: 'users-admin',
		label: i18n.t('modules/admin/const/routing___gebruikersbeheer'),
		href: '',
		children: ADMIN_USERS_LINKS,
	},
];

export const ADMIN_SPACES_LINKS = (): AdminNavigationLink[] => [
	{
		id: 'spaces',
		label: i18n.t('modules/admin/const/routing___alle-leeszalen'),
		href: '/admin/leeszalenbeheer/leeszalen',
	},
	{
		id: 'requests',
		label: i18n.t('modules/admin/const/routing___aanvragen'),
		href: '/admin/leeszalenbeheer/aanvragen',
	},
	{
		id: 'visitors',
		label: i18n.t('modules/admin/const/routing___actieve-bezoekers'),
		href: '/admin/leeszalenbeheer/bezoekers',
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
		label: i18n.t('modules/admin/const/routing___gebruikers'),
		href: '/admin/gebruikersbeheer/gebruikers',
	},
	{
		id: 'permissions',
		label: i18n.t('modules/admin/const/routing___groepen-en-permissies'),
		href: '/admin/gebruikersbeheer/permissies',
	},
];
