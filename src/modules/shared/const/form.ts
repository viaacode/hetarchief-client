import { i18n } from 'next-i18next';

import { IconProps } from '@shared/components';

export const OPTIONAL_LABEL = (): string => `(${i18n?.t('modules/shared/const/form___optioneel')})`;

export const VIEW_TOGGLE_OPTIONS = [
	{
		id: 'grid',
		iconName: 'grid-view' as IconProps['name'],
	},
	{
		id: 'list',
		iconName: 'list-view' as IconProps['name'],
	},
];
