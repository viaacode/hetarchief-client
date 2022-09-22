import { IconProps } from '@shared/components';
import { tText } from '@shared/helpers/translate';

export const OPTIONAL_LABEL = (): string => `(${tText('modules/shared/const/form___optioneel')})`;

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
