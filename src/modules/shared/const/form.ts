import { IconProps } from '@shared/components';
import { TranslationService } from '@shared/services/translation-service/translation-service';

export const OPTIONAL_LABEL = (): string =>
	`(${TranslationService.getTranslation('modules/shared/const/form___optioneel')})`;

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
