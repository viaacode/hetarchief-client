import { IconName, IconNamesLight } from '@shared/components';
import { ROUTE_PARTS, ROUTES } from '@shared/const';
import { tText } from '@shared/helpers/translate';

export const CP_ADMIN_SEARCH_VISITOR_SPACE_KEY = 'search-visitor-space';

export const CP_ADMIN_NAVIGATION_LINKS = (): {
	id: string;
	label: string;
	href: string;
	iconName?: IconName;
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
	{
		id: CP_ADMIN_SEARCH_VISITOR_SPACE_KEY,
		label: tText('modules/cp/const/index___naar-mijn-bezoekerstool'),
		href: `/${ROUTE_PARTS.search}`,
		iconName: IconNamesLight.Search,
	},
];
