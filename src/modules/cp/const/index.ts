import { Permission } from '@account/const';
import type { IconName } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import type { Locale } from '@shared/utils/i18n';
import { isNil } from 'lodash-es';

export const CP_ADMIN_SEARCH_VISITOR_SPACE_KEY = 'search-visitor-space';

/**
 * Key users with evaluator role are permitted in CP admin and will get the option hardcoded
 * So we need the possibility check on permissions and other user settings
 *
 * @param locale
 * @param permissions
 * @param maintainerSlug
 * @param isCpAdmin
 * @constructor
 */
export const CP_ADMIN_NAVIGATION_LINKS = (
	locale: Locale,
	permissions: Permission[],
	maintainerSlug?: string,
	isCpAdmin: boolean = false
): {
	id: string;
	label: string;
	href: string;
	iconName?: IconName;
}[] => {
	return [
		...(permissions.includes(Permission.MANAGE_CP_VISIT_REQUESTS)
			? [
					{
						id: 'requests',
						label: tText('modules/cp/const/index___toegangsaanvragen'),
						href: ROUTES_BY_LOCALE[locale].cpAdminVisitRequests,
					},
				]
			: []),
		...(permissions.includes(Permission.VIEW_ANY_MATERIAL_REQUESTS)
			? [
					{
						id: 'material-requests',
						label: tText('modules/cp/const/index___materiaalaanvragen'),
						href: ROUTES_BY_LOCALE[locale].cpAdminMaterialRequests,
					},
				]
			: []),
		...(permissions.includes(Permission.MANAGE_CP_VISIT_REQUESTS)
			? [
					{
						id: 'visitors',
						label: tText('modules/cp/const/index___bezoekers'),
						href: ROUTES_BY_LOCALE[locale].cpAdminVisitors,
					},
				]
			: []),
		...(permissions.includes(Permission.UPDATE_OWN_SPACE)
			? [
					{
						id: 'settings',
						label: tText('modules/cp/const/index___instellingen'),
						href: ROUTES_BY_LOCALE[locale].cpAdminSettings,
					},
				]
			: []),
		...(!isNil(maintainerSlug) && isCpAdmin
			? [
					{
						id: CP_ADMIN_SEARCH_VISITOR_SPACE_KEY,
						label: tText('modules/cp/const/index___naar-mijn-bezoekerstool'),
						href: ROUTES_BY_LOCALE[locale].search,
						iconName: IconNamesLight.Search,
					},
				]
			: []),
	];
};
