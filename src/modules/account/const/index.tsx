import { i18n } from 'next-i18next';

export * from './my-collections.const';
export * from './my-history.const';

export const ACCOUNT_NAVIGATION_LINKS = (): {
	id: string;
	label: string;
	href: string;
	hasDivider?: boolean;
}[] => [
	{
		id: 'account-profile',
		label: i18n?.t('modules/account/const/index___mijn-profiel') ?? '',
		href: '/account/mijn-profiel',
	},
	{
		id: 'account-collections',
		label: i18n?.t('modules/account/const/index___mijn-mappen') ?? '',
		href: '/account/mijn-mappen',
	},
	{
		id: 'account-history',
		label: i18n?.t('modules/account/const/index___mijn-historiek') ?? '',
		href: '/account/mijn-historiek',
		hasDivider: true,
	},
];

export enum Permission {
	// Visit Requests
	READ_ALL_VISIT_REQUESTS = 'READ_ALL_VISIT_REQUESTS',
	APPROVE_DENY_ALL_VISIT_REQUESTS = 'APPROVE_DENY_ALL_VISIT_REQUESTS',
	READ_CP_VISIT_REQUESTS = 'READ_CP_VISIT_REQUESTS',
	APPROVE_DENY_CP_VISIT_REQUESTS = 'APPROVE_DENY_CP_VISIT_REQUESTS',
	READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	CREATE_VISIT_REQUEST = 'CREATE_VISIT_REQUEST',
	UPDATE_VISIT_REQUEST = 'UPDATE_VISIT_REQUEST',
	CANCEL_OWN_VISIT_REQUEST = 'CANCEL_OWN_VISIT_REQUEST',
	// Objects
	SEARCH_OBJECTS = 'SEARCH_OBJECTS',
	EXPORT_OBJECT = 'EXPORT_OBJECT',
	// Collections
	MANAGE_FOLDERS = 'MANAGE_FOLDERS',
	// Spaces
	/** Spaces */
	READ_ALL_SPACES = 'READ_ALL_SPACES',
	UPDATE_OWN_SPACE = 'UPDATE_OWN_SPACE',
	UPDATE_ALL_SPACES = 'UPDATE_ALL_SPACES',
	// Admin
	EDIT_ANY_CONTENT_PAGES = 'EDIT_ANY_CONTENT_PAGES',
	EDIT_OWN_CONTENT_PAGES = 'EDIT_OWN_CONTENT_PAGES',
	SEARCH = 'SEARCH',
	// Kiosk
	SHOW_RESEARCH_WARNING = 'SHOW_RESEARCH_WARNING',
	MANAGE_ACCOUNT = 'MANAGE_ACCOUNT',
	SHOW_LINKED_SPACE_AS_HOMEPAGE = 'SHOW_LINKED_SPACE_AS_HOMEPAGE',
}
