import { IconNamesLight } from '@shared/components/Icon';
import { tText } from '@shared/helpers/translate';

export const OPTIONAL_LABEL = (): string => `(${tText('modules/shared/const/form___optioneel')})`;

export const VIEW_TOGGLE_OPTIONS = [
	{
		id: 'grid',
		iconName: IconNamesLight.GridView,
	},
	{
		id: 'list',
		iconName: IconNamesLight.ListView,
	},
];
