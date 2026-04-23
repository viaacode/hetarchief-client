import type { CommunicationFormState } from '@account/types';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import type { Locale } from '@shared/utils/i18n';
import type { ReactNode } from 'react';
import { boolean, object, type Schema } from 'yup';

export * from './my-folders.const';
export * from './my-history.const';
export * from './my-material-requests.const';

interface NavigationLinkInfo {
	id: string;
	label: string;
	href: string;
	hasDivider?: boolean;
	children?: NavigationLinkInfo[];
}

export const COMMUNICATION_FORM_SCHEMA = (): Schema<CommunicationFormState> =>
	object({
		acceptNewsletter: boolean().required(
			tText('modules/account/const/account___ik-ontvang-graag-de-nieuwsbrief-is-verplicht')
		),
	});

export const GET_ACCOUNT_NAVIGATION_LINKS = (locale: Locale): NavigationLinkInfo[] => {
	const hasAccountHistoryPerm = useHasAnyPermission(
		Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS
	);
	const hasOwnMaterialRequestsPerm = useHasAnyPermission(Permission.VIEW_OWN_MATERIAL_REQUESTS);
	const hasOtherMaterialRequestsPerm = useHasAnyPermission(Permission.VIEW_ANY_MATERIAL_REQUESTS);
	const hasPersonalFolderPerm = useHasAnyPermission(Permission.MANAGE_FOLDERS);
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);

	const links: NavigationLinkInfo[] = [
		{
			id: 'account-profile',
			label: tText('modules/account/const/index___mijn-profiel'),
			href: ROUTES_BY_LOCALE[locale].accountMyProfile,
		},
	];

	if (hasPersonalFolderPerm) {
		links.push({
			id: 'account-folders',
			label: tText('modules/account/const/index___mijn-mappen'),
			href: ROUTES_BY_LOCALE[locale].accountMyFolders,
		});
	}

	if (hasAccountHistoryPerm) {
		links.push({
			id: 'account-history',
			label: tText('modules/account/const/index___mijn-bezoek-historiek'),
			href: ROUTES_BY_LOCALE[locale].accountMyVisitHistory,
			hasDivider: true,
		});
	}

	if (hasOwnMaterialRequestsPerm) {
		if (hasOtherMaterialRequestsPerm) {
			links.push({
				...GET_ACCOUNT_OUTGOING_MATERIAL_REQUEST_LINKS(locale),
				children: GET_ACCOUNT_MATERIAL_REQUEST_LINKS(locale, isMeemooAdmin),
			});
		} else {
			links.push(GET_ACCOUNT_OUTGOING_MATERIAL_REQUEST_LINKS(locale));
		}
	}

	return links;
};

const GET_ACCOUNT_MATERIAL_REQUEST_LINKS = (
	locale: Locale,
	isMeemooAdmin: boolean
): NavigationLinkInfo[] => {
	if (isMeemooAdmin) {
		return [
			GET_ACCOUNT_OUTGOING_MATERIAL_REQUEST_LINKS(locale),
			{
				id: 'account-material-requests-admin',
				label: tText('modules/account/const/index___alle-materiaalaanvragen'),
				href: ROUTES_BY_LOCALE[locale].adminMaterialRequests,
				hasDivider: true,
			},
		];
	}

	return [
		GET_ACCOUNT_OUTGOING_MATERIAL_REQUEST_LINKS(locale),
		{
			id: 'account-material-requests-incoming',
			label: tText('modules/account/const/index___inkomende-materiaalaanvragen'),
			href: ROUTES_BY_LOCALE[locale].cpAdminMaterialRequests,
			hasDivider: true,
		},
	];
};

const GET_ACCOUNT_OUTGOING_MATERIAL_REQUEST_LINKS = (locale: Locale): NavigationLinkInfo => ({
	id: 'account-material-requests-outgoing',
	label: tText('modules/account/const/index___mijn-materiaalaanvragen'),
	href: ROUTES_BY_LOCALE[locale].accountMyMaterialRequests,
	hasDivider: true,
});

export const GET_TRANSLATED_LANGUAGE_LABELS = () => ({
	nl: tText('modules/account/const/index___nederlands'),
	en: tText('modules/account/const/index___engels'),
});

export enum Permission {
	// Visit Requests
	MANAGE_ALL_VISIT_REQUESTS = 'MANAGE_ALL_VISIT_REQUESTS',
	MANAGE_CP_VISIT_REQUESTS = 'MANAGE_CP_VISIT_REQUESTS',
	READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	CREATE_VISIT_REQUEST = 'CREATE_VISIT_REQUEST',
	CANCEL_OWN_VISIT_REQUEST = 'CANCEL_OWN_VISIT_REQUEST',
	// Objects
	SEARCH_OBJECTS = 'SEARCH_OBJECTS',
	EXPORT_OBJECT = 'EXPORT_OBJECT',
	DOWNLOAD_OBJECT = 'DOWNLOAD_OBJECT',
	// Collections
	MANAGE_FOLDERS = 'MANAGE_FOLDERS',
	// Spaces
	READ_ALL_SPACES = 'READ_ALL_SPACES',
	UPDATE_OWN_SPACE = 'UPDATE_OWN_SPACE',
	UPDATE_ALL_SPACES = 'UPDATE_ALL_SPACES',
	CREATE_SPACES = 'CREATE_SPACES',
	EDIT_ALL_SPACES_STATUS = 'EDIT_ALL_SPACES_STATUS',
	// Kiosk
	SHOW_RESEARCH_WARNING = 'SHOW_RESEARCH_WARNING',
	MANAGE_ACCOUNT = 'MANAGE_ACCOUNT',
	CAN_EDIT_PROFILE_INFO = 'CAN_EDIT_PROFILE_INFO',
	SHOW_LINKED_SPACE_AS_HOMEPAGE = 'SHOW_LINKED_SPACE_AS_HOMEPAGE',
	VIEW_PREVIOUS_AND_NEXT_NEWSPAPER_BUTTONS = 'VIEW_PREVIOUS_AND_NEXT_NEWSPAPER_BUTTONS',
	// Admin-core
	EDIT_ANY_COLLECTIONS = 'EDIT_ANY_COLLECTIONS',
	EDIT_USER_GROUPS = 'EDIT_USER_GROUPS',
	VIEW_BUNDLES_OVERVIEW = 'VIEW_BUNDLES_OVERVIEW',
	VIEW_COLLECTIONS_OVERVIEW = 'VIEW_COLLECTIONS_OVERVIEW',
	VIEW_USERS_IN_SAME_COMPANY = 'VIEW_USERS_IN_SAME_COMPANY',
	CREATE_CONTENT_PAGES = 'CREATE_CONTENT_PAGES',
	DELETE_ANY_CONTENT_PAGES = 'DELETE_ANY_CONTENT_PAGES',
	DELETE_ANY_USER = 'DELETE_ANY_USER',
	DELETE_OWN_BUNDLES = 'DELETE_OWN_BUNDLES',
	DELETE_OWN_COLLECTIONS = 'DELETE_OWN_COLLECTIONS',
	EDIT_ANY_CONTENT_PAGES = 'EDIT_ANY_CONTENT_PAGES',
	EDIT_ANY_USER = 'EDIT_ANY_USER',
	EDIT_ASSIGNMENTS = 'EDIT_ASSIGNMENTS',
	EDIT_CONTENT_PAGE_AUTHOR = 'EDIT_CONTENT_PAGE_AUTHOR',
	EDIT_CONTENT_PAGE_LABELS = 'EDIT_CONTENT_PAGE_LABELS',
	EDIT_NAVIGATION_BARS = 'EDIT_NAVIGATION_BARS',
	EDIT_OWN_ASSIGNMENTS = 'EDIT_OWN_ASSIGNMENTS',
	EDIT_OWN_BUNDLES = 'EDIT_OWN_BUNDLES',
	EDIT_OWN_COLLECTIONS = 'EDIT_OWN_COLLECTIONS',
	EDIT_OWN_CONTENT_PAGES = 'EDIT_OWN_CONTENT_PAGES',
	EDIT_PERMISSION_GROUPS = 'EDIT_PERMISSION_GROUPS',
	EDIT_PROTECTED_PAGE_STATUS = 'EDIT_PROTECTED_PAGE_STATUS',
	EDIT_TRANSLATIONS = 'EDIT_TRANSLATIONS',
	EDIT_USER_TEMP_ACCESS = 'EDIT_USER_TEMP_ACCESS',
	PUBLISH_ANY_CONTENT_PAGE = 'PUBLISH_ANY_CONTENT_PAGE',
	PUBLISH_OWN_BUNDLES = 'PUBLISH_OWN_BUNDLES',
	PUBLISH_OWN_COLLECTIONS = 'PUBLISH_OWN_COLLECTIONS',
	UNPUBLISH_ANY_CONTENT_PAGE = 'UNPUBLISH_ANY_CONTENT_PAGE',
	VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
	VIEW_ANY_PUBLISHED_ITEMS = 'VIEW_ANY_PUBLISHED_ITEMS',
	VIEW_OWN_BUNDLES = 'VIEW_OWN_BUNDLES',
	VIEW_OWN_COLLECTIONS = 'VIEW_OWN_COLLECTIONS',
	VIEW_USERS = 'VIEW_USERS',
	// Maintenance alerts
	VIEW_ANY_MAINTENANCE_ALERTS = 'VIEW_ANY_MAINTENANCE_ALERTS',
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
