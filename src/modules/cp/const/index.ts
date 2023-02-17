import { ROUTES } from '@shared/const';
import { tText } from '@shared/helpers/translate';

export const CP_ADMIN_NAVIGATION_LINKS = (): {
	id: string;
	label: string;
	href: string;
}[] => [
	{
		id: 'requests',
		label: tText('modules/cp/const/index___aanvragen'),
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
