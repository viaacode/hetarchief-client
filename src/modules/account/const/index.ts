import { type ReactNode } from 'react';
import { boolean, object, type SchemaOf } from 'yup';

import { type CommunicationFormState } from '@account/types';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyPermission } from '@shared/hooks/has-permission';

export * from './my-collections.const';
export * from './my-history.const';
export * from './my-material-requests.const';

interface NavigationLinkInfo {
	id: string;
	label: string;
	href: string;
	hasDivider?: boolean;
}

export const COMMUNICATION_FORM_SCHEMA = (): SchemaOf<CommunicationFormState> =>
	object({
		acceptNewsletter: boolean().required(
			tText('modules/account/const/account___ik-ontvang-graag-de-nieuwsbrief-is-verplicht')
		),
	});

export const GET_ACCOUNT_NAVIGATION_LINKS = (): NavigationLinkInfo[] => {
	const hasAccountHistoryPerm = useHasAnyPermission(
		Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS
	);
	const hasMaterialRequestsPerm = useHasAnyPermission(Permission.VIEW_OWN_MATERIAL_REQUESTS);

	const links: NavigationLinkInfo[] = [
		{
			id: 'account-profile',
			label: tText('modules/account/const/index___mijn-profiel'),
			href: '/account/mijn-profiel',
		},
		{
			id: 'account-collections',
			label: tText('modules/account/const/index___mijn-mappen'),
			href: '/account/mijn-mappen',
		},
	];

	if (hasAccountHistoryPerm) {
		links.push({
			id: 'account-history',
			label: tText('modules/account/const/index___mijn-bezoek-historiek'),
			href: '/account/mijn-bezoek-historiek',
			hasDivider: true,
		});
	}

	if (hasMaterialRequestsPerm) {
		links.push({
			id: 'account-material-requests',
			label: tText('modules/account/const/index___mijn-materiaalaanvragen'),
			href: '/account/mijn-materiaalaanvragen',
			hasDivider: true,
		});
	}

	return links;
};

export const GET_TRANSLATED_LANGUAGE_LABELS = () => ({
	nl: tText('modules/account/const/index___nederlands'),
	en: tText('modules/account/const/index___engels'),
});

export enum Permission {
	// Maintenance alerts
	VIEW_ANY_MAINTENANCE_ALERTS = 'VIEW_ANY_MAINTENANCE_ALERTS',
	CREATE_MAINTENANCE_ALERTS = 'CREATE_MAINTENANCE_ALERTS',
	EDIT_MAINTENANCE_ALERTS = 'EDIT_MAINTENANCE_ALERTS',
	DELETE_MAINTENANCE_ALERTS = 'DELETE_MAINTENANCE_ALERTS',
	// Visit Requests
	MANAGE_ALL_VISIT_REQUESTS = 'MANAGE_ALL_VISIT_REQUESTS',
	MANAGE_CP_VISIT_REQUESTS = 'MANAGE_CP_VISIT_REQUESTS',
	READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	CREATE_VISIT_REQUEST = 'CREATE_VISIT_REQUEST',
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
	CREATE_SPACES = 'CREATE_SPACES',
	EDIT_ALL_SPACES_STATUS = 'EDIT_ALL_SPACES_STATUS',
	// Admin
	EDIT_ANY_CONTENT_PAGES = 'EDIT_ANY_CONTENT_PAGES',
	EDIT_OWN_CONTENT_PAGES = 'EDIT_OWN_CONTENT_PAGES',
	SEARCH = 'SEARCH',
	EDIT_TRANSLATIONS = 'EDIT_TRANSLATIONS',
	EDIT_PERMISSION_GROUPS = 'EDIT_PERMISSION_GROUPS',
	VIEW_USERS = 'VIEW_USERS',
	// Kiosk
	SHOW_RESEARCH_WARNING = 'SHOW_RESEARCH_WARNING',
	MANAGE_ACCOUNT = 'MANAGE_ACCOUNT',
	SHOW_LINKED_SPACE_AS_HOMEPAGE = 'SHOW_LINKED_SPACE_AS_HOMEPAGE',
	CREATE_CONTENT_PAGES = 'CREATE_CONTENT_PAGES',
	DELETE_ANY_CONTENT_PAGES = 'DELETE_ANY_CONTENT_PAGES',
	DELETE_ANY_USER = 'DELETE_ANY_USER',
	DELETE_OWN_BUNDLES = 'DELETE_OWN_BUNDLES',
	DELETE_OWN_COLLECTIONS = 'DELETE_OWN_COLLECTIONS',
	EDIT_ANY_USER = 'EDIT_ANY_USER',
	EDIT_ASSIGNMENTS = 'EDIT_ASSIGNMENTS',
	EDIT_CONTENT_PAGE_AUTHOR = 'EDIT_CONTENT_PAGE_AUTHOR',
	EDIT_CONTENT_PAGE_LABELS = 'EDIT_CONTENT_PAGE_LABELS',
	EDIT_OWN_ASSIGNMENTS = 'EDIT_OWN_ASSIGNMENTS',
	EDIT_OWN_BUNDLES = 'EDIT_OWN_BUNDLES',
	EDIT_OWN_COLLECTIONS = 'EDIT_OWN_COLLECTIONS',
	EDIT_PROTECTED_PAGE_STATUS = 'EDIT_PROTECTED_PAGE_STATUS',
	EDIT_USER_TEMP_ACCESS = 'EDIT_USER_TEMP_ACCESS',
	PUBLISH_ANY_CONTENT_PAGE = 'PUBLISH_ANY_CONTENT_PAGE',
	PUBLISH_OWN_BUNDLES = 'PUBLISH_OWN_BUNDLES',
	PUBLISH_OWN_COLLECTIONS = 'PUBLISH_OWN_COLLECTIONS',
	UNPUBLISH_ANY_CONTENT_PAGE = 'UNPUBLISH_ANY_CONTENT_PAGE',
	VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
	VIEW_ANY_PUBLISHED_ITEMS = 'VIEW_ANY_PUBLISHED_ITEMS',
	VIEW_OWN_BUNDLES = 'VIEW_OWN_BUNDLES',
	VIEW_OWN_COLLECTIONS = 'VIEW_OWN_COLLECTIONS',
	EDIT_NAVIGATION_BARS = 'EDIT_NAVIGATION_BARS',
	CAN_EDIT_PROFILE_INFO = 'CAN_EDIT_PROFILE_INFO',
	// Material Requests
	VIEW_ANY_MATERIAL_REQUESTS = 'VIEW_ANY_MATERIAL_REQUESTS',
	VIEW_OWN_MATERIAL_REQUESTS = 'VIEW_OWN_MATERIAL_REQUESTS',
	CREATE_MATERIAL_REQUESTS = 'CREATE_MATERIAL_REQUESTS',
	EDIT_OWN_MATERIAL_REQUESTS = 'EDIT_OWN_MATERIAL_REQUESTS',
	DELETE_OWN_MATERIAL_REQUESTS = 'DELETE_OWN_MATERIAL_REQUESTS',
}

export enum GroupName {
	VISITOR = 'VISITOR',
	KIOSK_VISITOR = 'KIOSK_VISITOR',
	MEEMOO_ADMIN = 'MEEMOO_ADMIN',
	CP_ADMIN = 'CP_ADMIN',
	ANONYMOUS = 'ANONYMOUS',
}

export const GET_PERMISSION_TRANSLATIONS_BY_GROUP = (): Record<
	GroupName,
	{ name: string; description: ReactNode | string; isHidden?: boolean }
> => ({
	[GroupName.VISITOR]: {
		name: tText('modules/account/const/account___groep-bezoeker--titel'),
		description: tHtml('modules/account/const/account___groep-bezoeker--omschrijving'),
		isHidden: true,
	},
	[GroupName.KIOSK_VISITOR]: {
		name: tText('modules/account/const/account___groep-kiosk--titel'),
		description: tHtml('modules/account/const/account___groep-kiosk--omschrijving'),
	},
	[GroupName.MEEMOO_ADMIN]: {
		name: tText('modules/account/const/account___groep-admin--titel'),
		description: tHtml('modules/account/const/account___groep-admin--omschrijving'),
	},
	[GroupName.CP_ADMIN]: {
		name: tText('modules/account/const/account___groep-cp--titel'),
		description: tHtml('modules/account/const/account___groep-cp--omschrijving'),
	},
	[GroupName.ANONYMOUS]: {
		name: tText('modules/account/const/index___groep-anoniem--titel'),
		description: tHtml('modules/account/const/index___groep-anoniem--omschrijving'),
	},
});
