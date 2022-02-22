import { i18n } from 'next-i18next';

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
