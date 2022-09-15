import { tText } from '@shared/helpers/translate';

export const CP_ADMIN_NAVIGATION_LINKS = (): {
	id: string;
	label: string;
	href: string;
}[] => [
	{
		id: 'requests',
		label: tText('modules/cp/const/index___aanvragen'),
		href: '/beheer/aanvragen',
	},
	{
		id: 'visitors',
		label: tText('modules/cp/const/index___bezoekers'),
		href: '/beheer/bezoekers',
	},
	{
		id: 'settings',
		label: tText('modules/cp/const/index___instellingen'),
		href: '/beheer/instellingen',
	},
];
