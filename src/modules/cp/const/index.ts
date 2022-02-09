import { i18n } from 'next-i18next';

export const CP_ADMIN_NAVIGATION_LINKS = (): {
	id: string;
	label: string | undefined;
	href: string;
}[] => [
	{
		id: 'requests',
		label: i18n?.t('modules/cp/const/index___aanvragen'),
		href: 'beheer/aanvragen',
	},
	{
		id: 'visitors',
		label: i18n?.t('modules/cp/const/index___bezoekers'),
		href: 'beheer/bezoekers',
	},
	{
		id: 'settings',
		label: i18n?.t('modules/cp/const/index___instellingen'),
		href: 'beheer/instellingen',
	},
];
