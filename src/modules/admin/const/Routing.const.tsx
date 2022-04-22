import { i18n } from 'next-i18next';

export interface AdminNavigationLink {
	id: string;
	label: string;
	href: string;
	children?: () => AdminNavigationLink[];
}

export const ADMIN_NAVIGATION_LINKS = (): AdminNavigationLink[] => [
	{
		id: 'spaces-admin',
		label: i18n?.t('modules/admin/const/routing___leeszalenbeheer') ?? '',
		href: '',
		children: ADMIN_SPACES_LINKS,
	},
];

export const ADMIN_SPACES_LINKS = (): AdminNavigationLink[] => [
	{
		id: 'spaces',
		label: i18n?.t('modules/admin/const/routing___alle-leeszalen') ?? '',
		href: '/admin/leeszalenbeheer/leeszalen',
	},
	{
		id: 'requests',
		label: i18n?.t('modules/admin/const/routing___aanvragen') ?? '',
		href: '/admin/leeszalenbeheer/aanvragen',
	},
	{
		id: 'visitors',
		label: i18n?.t('modules/admin/const/routing___actieve-bezoekers') ?? '',
		href: '/admin/leeszalenbeheer/bezoekers',
	},
];
