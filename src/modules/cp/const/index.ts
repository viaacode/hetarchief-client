import { IconName, IconNamesLight } from '@shared/components';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { Locale } from '@shared/utils';

export const CP_ADMIN_SEARCH_VISITOR_SPACE_KEY = 'search-visitor-space';

export const CP_ADMIN_NAVIGATION_LINKS = (
	locale: Locale
): {
	id: string;
	label: string;
	href: string;
	iconName?: IconName;
}[] => [
	{
		id: 'requests',
		label: tText('modules/cp/const/index___toegangsaanvragen'),
		href: ROUTES_BY_LOCALE[locale].cpAdminVisitRequests,
	},
	{
		id: 'material-requests',
		label: tText('modules/cp/const/index___materiaalaanvragen'),
		href: ROUTES_BY_LOCALE[locale].cpAdminMaterialRequests,
	},
	{
		id: 'visitors',
		label: tText('modules/cp/const/index___bezoekers'),
		href: ROUTES_BY_LOCALE[locale].cpAdminVisitors,
	},
	{
		id: 'settings',
		label: tText('modules/cp/const/index___instellingen'),
		href: ROUTES_BY_LOCALE[locale].cpAdminSettings,
	},
	{
		id: CP_ADMIN_SEARCH_VISITOR_SPACE_KEY,
		label: tText('modules/cp/const/index___naar-mijn-bezoekerstool'),
		href: ROUTES_BY_LOCALE[locale].search,
		iconName: IconNamesLight.Search,
	},
];
