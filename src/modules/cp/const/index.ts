import { TranslationService } from '@shared/services/translation-service/translation-service';

export const CP_ADMIN_NAVIGATION_LINKS = (): {
	id: string;
	label: string;
	href: string;
}[] => [
	{
		id: 'requests',
		label: TranslationService.getTranslation('modules/cp/const/index___aanvragen'),
		href: '/beheer/aanvragen',
	},
	{
		id: 'visitors',
		label: TranslationService.getTranslation('modules/cp/const/index___bezoekers'),
		href: '/beheer/bezoekers',
	},
	{
		id: 'settings',
		label: TranslationService.getTranslation('modules/cp/const/index___instellingen'),
		href: '/beheer/instellingen',
	},
];
