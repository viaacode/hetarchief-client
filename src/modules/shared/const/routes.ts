import { AdminConfig } from '@meemoo/admin-core-ui/dist/react-admin/core/config/config.types';

import { Locale } from '@shared/utils';

const ROUTE_PARTS_NL = {
	about: 'over-bezoekersruimtes',
	accessRequested: 'toegang-aangevraagd',
	account: 'account',
	visitRequests: 'toegangsaanvragen',
	materialRequests: 'materiaalaanvragen',
	myMaterialRequests: 'mijn-materiaalaanvragen',
	faq: 'faq',
	userPolicy: 'gebruiksvoorwaarden',
	userManagement: 'gebruikersbeheer',
	user: 'gebruikers',
	permissions: 'permissies',
	translations: 'vertalingen',
	admin: 'admin',
	cpAdmin: 'beheer',
	content: 'content',
	contentPageLabels: 'content-pagina-labels',
	cookiePolicy: 'cookiebeleid',
	create: 'maak',
	edit: 'bewerk',
	logout: 'uitloggen',
	myFolders: 'mijn-mappen',
	myHistory: 'mijn-bezoek-historiek',
	myProfile: 'mijn-profiel',
	navigation: 'navigatie',
	notFound: '404',
	settings: 'instellingen',
	users: 'gebruikers',
	visitRequest: 'aanvraag',
	visitorSpaceManagement: 'bezoekersruimtesbeheer',
	visitorSpaces: 'bezoekersruimtes',
	activeVisitors: 'actieve-bezoekers',
	search: 'zoeken',
	visitors: 'bezoekers',
	visit: 'bezoek',
	alerts: 'meldingen',
	shareFolder: 'map-delen',
	kioskConditions: 'kiosk-voorwaarden',
} as const;

const ROUTE_PARTS_EN = {
	about: 'about-visitorspaces',
	accessRequested: 'access-requested',
	account: 'account',
	visitRequests: 'visitrequests',
	materialRequests: 'materialrequests',
	myMaterialRequests: 'my-materialrequests',
	faq: 'faq',
	userPolicy: 'userconditions',
	userManagement: 'usermanagement',
	user: 'users',
	permissions: 'permissions',
	translations: 'translations',
	admin: 'admin',
	cpAdmin: 'management',
	content: 'content',
	contentPageLabels: 'content-page-labels',
	cookiePolicy: 'cookiepolicy',
	create: 'create',
	edit: 'edit',
	logout: 'logout',
	myFolders: 'my-folders',
	myHistory: 'my-visit-history',
	myProfile: 'my-profile',
	navigation: 'navigation',
	notFound: '404',
	settings: 'settings',
	users: 'users',
	visitRequest: 'requests',
	visitorSpaceManagement: 'visitorspacemanagement',
	visitorSpaces: 'visitorspaces',
	activeVisitors: 'active-visitors',
	search: 'search',
	visitors: 'visitors',
	visit: 'visit',
	alerts: 'alerts',
	shareFolder: 'folder share',
	kioskConditions: 'kiosk-conditions',
} as const;

// Note: Also used to set 'Bezoekersruimtes' active state if url does not start with any of the following prefixes
const ROUTE_PREFIXES_NL = {
	cpAdmin: ROUTE_PARTS_NL.cpAdmin,
	admin: ROUTE_PARTS_NL.admin,
	account: ROUTE_PARTS_NL.account,
	about: ROUTE_PARTS_NL.about,
	faq: ROUTE_PARTS_NL.faq,
	gebruiksvoorwaarden: ROUTE_PARTS_NL.userPolicy,
	cookiebeleid: ROUTE_PARTS_NL.cookiePolicy,
	notFound: ROUTE_PARTS_NL.notFound,
} as const;

const ROUTE_PREFIXES_EN = {
	cpAdmin: ROUTE_PARTS_EN.cpAdmin,
	admin: ROUTE_PARTS_EN.admin,
	account: ROUTE_PARTS_EN.account,
	about: ROUTE_PARTS_EN.about,
	faq: ROUTE_PARTS_EN.faq,
	gebruiksvoorwaarden: ROUTE_PARTS_EN.userPolicy,
	cookiebeleid: ROUTE_PARTS_EN.cookiePolicy,
	notFound: ROUTE_PARTS_EN.notFound,
} as const;

const ROUTES_NL = {
	home: '/',
	search: `/${ROUTE_PARTS_NL.search}`,
	visit: `/${ROUTE_PARTS_NL.visit}`,
	space: `/${ROUTE_PARTS_NL.search}/:slug`,
	termsOfService: '/' + ROUTE_PARTS_NL.userPolicy,
	cookiePolicy: '/' + ROUTE_PARTS_NL.cookiePolicy,
	myFolders: `/${ROUTE_PARTS_NL.account}/${ROUTE_PARTS_NL.myFolders}`,
	myHistory: `/${ROUTE_PARTS_NL.account}/${ROUTE_PARTS_NL.myHistory}`,
	visitRequested: `/${ROUTE_PARTS_NL.visit}/:slug/${ROUTE_PARTS_NL.accessRequested}`,
	adminEditSpace: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.visitorSpaceManagement}/${ROUTE_PARTS_NL.visitorSpaces}/:slug`,
	cpAdminVisitors: `/${ROUTE_PARTS_NL.cpAdmin}/${ROUTE_PARTS_NL.visitors}`,
	cpAdminSettings: `/${ROUTE_PARTS_NL.cpAdmin}/${ROUTE_PARTS_NL.settings}`,
	cpAdminRequests: `/${ROUTE_PARTS_NL.cpAdmin}/${ROUTE_PARTS_NL.visitRequests}`,
	cpAdminMaterialRequests: `/${ROUTE_PARTS_NL.cpAdmin}/${ROUTE_PARTS_NL.materialRequests}`,
	shareFolder: `/${ROUTE_PARTS_NL.account}/${ROUTE_PARTS_NL.shareFolder}/:id`,
} as const;

const ROUTES_EN = {
	home: '/',
	search: `/${ROUTE_PARTS_EN.search}`,
	visit: `/${ROUTE_PARTS_EN.visit}`,
	space: `/${ROUTE_PARTS_EN.search}/:slug`,
	termsOfService: '/' + ROUTE_PARTS_EN.userPolicy,
	cookiePolicy: '/' + ROUTE_PARTS_EN.cookiePolicy,
	myFolders: `/${ROUTE_PARTS_EN.account}/${ROUTE_PARTS_EN.myFolders}`,
	myHistory: `/${ROUTE_PARTS_EN.account}/${ROUTE_PARTS_EN.myHistory}`,
	visitRequested: `/${ROUTE_PARTS_EN.visit}/:slug/${ROUTE_PARTS_EN.accessRequested}`,
	adminEditSpace: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.visitorSpaceManagement}/${ROUTE_PARTS_EN.visitorSpaces}/:slug`,
	cpAdminVisitors: `/${ROUTE_PARTS_EN.cpAdmin}/${ROUTE_PARTS_EN.visitors}`,
	cpAdminSettings: `/${ROUTE_PARTS_EN.cpAdmin}/${ROUTE_PARTS_EN.settings}`,
	cpAdminRequests: `/${ROUTE_PARTS_EN.cpAdmin}/${ROUTE_PARTS_EN.visitRequests}`,
	cpAdminMaterialRequests: `/${ROUTE_PARTS_EN.cpAdmin}/${ROUTE_PARTS_EN.materialRequests}`,
	shareFolder: `/${ROUTE_PARTS_EN.account}/${ROUTE_PARTS_EN.shareFolder}/:id`,
} as const;

const ADMIN_CORE_ROUTES_NL: AdminConfig['routes'] = {
	ADMIN_ALERTS_OVERVIEW: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.alerts}`,
	ADMIN_CONTENT_PAGE_CREATE: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.content}/${ROUTE_PARTS_NL.create}`,
	ADMIN_CONTENT_PAGE_DETAIL: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.content}/:id`,
	ADMIN_CONTENT_PAGE_EDIT: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.content}/:id/${ROUTE_PARTS_NL.edit}`,
	ADMIN_CONTENT_PAGE_OVERVIEW: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.content}`,
	ADMIN_CONTENT_PAGE_LABEL_CREATE: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.contentPageLabels}/${ROUTE_PARTS_NL.create}`,
	ADMIN_CONTENT_PAGE_LABEL_DETAIL: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.contentPageLabels}/:id`,
	ADMIN_CONTENT_PAGE_LABEL_EDIT: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.contentPageLabels}/:id/${ROUTE_PARTS_NL.edit}`,
	ADMIN_CONTENT_PAGE_LABEL_OVERVIEW: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.contentPageLabels}`,
	ADMIN_NAVIGATION_CREATE: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.navigation}/${ROUTE_PARTS_NL.create}`,
	ADMIN_NAVIGATION_DETAIL: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.navigation}/:navigationBarId`,
	ADMIN_NAVIGATION_ITEM_CREATE: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.navigation}/:navigationBarId/${ROUTE_PARTS_NL.create}`,
	ADMIN_NAVIGATION_ITEM_EDIT: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.navigation}/:navigationBarId/:navigationItemId/${ROUTE_PARTS_NL.edit}`,
	ADMIN_NAVIGATION_OVERVIEW: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.navigation}`,
	ADMIN_TRANSLATIONS_OVERVIEW: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.translations}`,
	ADMIN_USER_DETAIL: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.users}/:id`,
	ADMIN_USER_EDIT: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.users}/:id/${ROUTE_PARTS_NL.edit}`,
	ADMIN_USER_GROUP_CREATE: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.permissions}/${ROUTE_PARTS_NL.create}`,
	ADMIN_USER_GROUP_DETAIL: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.permissions}/:id`,
	ADMIN_USER_GROUP_EDIT: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.permissions}/:id/${ROUTE_PARTS_NL.edit}`,
	ADMIN_USER_GROUP_OVERVIEW: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.permissions}`,
	ADMIN_USER_OVERVIEW: `/${ROUTE_PARTS_NL.admin}/${ROUTE_PARTS_NL.users}`,
	SEARCH: `/${ROUTE_PARTS_NL.search}`,
	// AVO Specific
	BUNDLE_DETAIL: undefined,
	BUNDLE_EDIT: undefined,
	ADMIN_COLLECTIONS_OVERVIEW: undefined,
	ADMIN_BUNDLES_OVERVIEW: undefined,
	ADMIN_ASSIGNMENTS_OVERVIEW: undefined,
	ADMIN_ASSIGNMENT_PUPIL_COLLECTIONS_OVERVIEW: undefined,
	COLLECTION_DETAIL: undefined,
	ASSIGNMENT_DETAIL: undefined,
	ITEM_DETAIL: undefined,
	NEWS: undefined,
} as const;

const ADMIN_CORE_ROUTES_EN: AdminConfig['routes'] = {
	ADMIN_ALERTS_OVERVIEW: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.alerts}`,
	ADMIN_CONTENT_PAGE_CREATE: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.content}/${ROUTE_PARTS_EN.create}`,
	ADMIN_CONTENT_PAGE_DETAIL: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.content}/:id`,
	ADMIN_CONTENT_PAGE_EDIT: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.content}/:id/${ROUTE_PARTS_EN.edit}`,
	ADMIN_CONTENT_PAGE_OVERVIEW: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.content}`,
	ADMIN_CONTENT_PAGE_LABEL_CREATE: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.contentPageLabels}/${ROUTE_PARTS_EN.create}`,
	ADMIN_CONTENT_PAGE_LABEL_DETAIL: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.contentPageLabels}/:id`,
	ADMIN_CONTENT_PAGE_LABEL_EDIT: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.contentPageLabels}/:id/${ROUTE_PARTS_EN.edit}`,
	ADMIN_CONTENT_PAGE_LABEL_OVERVIEW: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.contentPageLabels}`,
	ADMIN_NAVIGATION_CREATE: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.navigation}/${ROUTE_PARTS_EN.create}`,
	ADMIN_NAVIGATION_DETAIL: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.navigation}/:navigationBarId`,
	ADMIN_NAVIGATION_ITEM_CREATE: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.navigation}/:navigationBarId/${ROUTE_PARTS_EN.create}`,
	ADMIN_NAVIGATION_ITEM_EDIT: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.navigation}/:navigationBarId/:navigationItemId/${ROUTE_PARTS_EN.edit}`,
	ADMIN_NAVIGATION_OVERVIEW: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.navigation}`,
	ADMIN_TRANSLATIONS_OVERVIEW: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.translations}`,
	ADMIN_USER_DETAIL: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.users}/:id`,
	ADMIN_USER_EDIT: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.users}/:id/${ROUTE_PARTS_EN.edit}`,
	ADMIN_USER_GROUP_CREATE: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.permissions}/${ROUTE_PARTS_EN.create}`,
	ADMIN_USER_GROUP_DETAIL: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.permissions}/:id`,
	ADMIN_USER_GROUP_EDIT: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.permissions}/:id/${ROUTE_PARTS_EN.edit}`,
	ADMIN_USER_GROUP_OVERVIEW: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.permissions}`,
	ADMIN_USER_OVERVIEW: `/${ROUTE_PARTS_EN.admin}/${ROUTE_PARTS_EN.users}`,
	SEARCH: `/${ROUTE_PARTS_EN.search}`,
} as const;

export enum KNOWN_STATIC_ROUTES {
	TermsOfService = '/gebruikersvoorwaarden-tekst',
	aboutTheVisitorTool = '/over-de-bezoekertool',
	Home = '',
}

export const ROUTE_PARTS_BY_LOCALE: Record<Locale, Record<keyof typeof ROUTE_PARTS_NL, string>> = {
	nl: ROUTE_PARTS_NL,
	en: ROUTE_PARTS_EN,
} as const;

export const ROUTES_BY_LOCALE: Record<Locale, Record<keyof typeof ROUTES_NL, string>> = {
	nl: ROUTES_NL,
	en: ROUTES_EN,
};

export const ADMIN_CORE_ROUTES_BY_LOCALE: Record<
	Locale,
	Partial<Record<keyof typeof ADMIN_CORE_ROUTES_NL, string>>
> = {
	nl: ADMIN_CORE_ROUTES_NL,
	en: ADMIN_CORE_ROUTES_EN,
};

export const ROUTE_PREFIXES_BY_LOCALE: Record<
	Locale,
	Record<keyof typeof ROUTE_PREFIXES_NL, string>
> = {
	nl: ROUTE_PREFIXES_NL,
	en: ROUTE_PREFIXES_EN,
};
