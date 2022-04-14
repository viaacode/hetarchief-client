import { i18n } from 'next-i18next';

export const MEEMOO_ADMIN_NAVIGATION_LINKS = (): {
	id: string;
	label: string;
	href: string;
}[] => [
	{
		id: 'navigation',
		label: i18n?.t('Navigatie') ?? '',
		href: '/admin/navigatie',
	},
	{
		id: 'content-pages',
		label: i18n?.t("Content pagina's") ?? '',
		href: '/admin/content',
	},
];
