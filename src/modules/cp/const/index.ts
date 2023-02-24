import { ROUTE_PARTS, ROUTES } from '@shared/const';
import { tText } from '@shared/helpers/translate';

export const CP_ADMIN_SEARCH_VISITOR_SPACE_KEY = 'search-visitor-space';

export const CP_ADMIN_NAVIGATION_TOP_LINKS = (): {
	id: string;
	label: string;
	href: string;
}[] => [
	{
		id: 'requests',
		label: tText('modules/cp/const/index___toegangsaanvragen'),
		href: ROUTES.beheerRequests,
	},
	{
		id: 'material-requests',
		label: tText('modules/cp/const/index___materiaalaanvragen'),
		href: ROUTES.beheerMaterialRequests,
	},
	{
		id: 'visitors',
		label: tText('modules/cp/const/index___bezoekers'),
		href: ROUTES.beheerVisitors,
	},
	{
		id: 'settings',
		label: tText('modules/cp/const/index___instellingen'),
		href: ROUTES.beheerSettings,
	},
];

export const CP_ADMIN_NAVIGATION_BOTTOM_LINKS = (): {
	id: string;
	label: string;
	href: string;
}[] => [
	{
		id: CP_ADMIN_SEARCH_VISITOR_SPACE_KEY,
		label: tText('modules/cp/const/index___doorzoek-eigen-collectie'),
		href: `/${ROUTE_PARTS.search}`,
	},
];
