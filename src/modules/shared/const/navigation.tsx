import { i18n } from 'next-i18next';

import { NavigationHamburgerProps } from '@shared/components';

export const NAV_HAMBURGER_PROPS = (): NavigationHamburgerProps => ({
	openLabel: i18n?.t('modules/shared/const/navigation___sluit') ?? '',
	closedLabel: i18n?.t('modules/shared/const/navigation___menu') ?? '',
});
