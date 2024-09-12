import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';

export const OPTIONAL_LABEL = (): string => `(${tText('modules/shared/const/form___optioneel')})`;

export const VIEW_TOGGLE_OPTIONS = [
	{
		id: 'grid',
		iconName: IconNamesLight.GridView,
		title: tText('modules/shared/const/form___hover-gridweergave'),
	},
	{
		id: 'list',
		iconName: IconNamesLight.ListView,
		title: tText('modules/shared/const/form___hover-lijstweergave'),
	},
];
