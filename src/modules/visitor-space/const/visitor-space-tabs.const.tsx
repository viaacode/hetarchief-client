import { type TabProps } from '@meemoo/react-components';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { SearchPageMediaType } from '@shared/types/ie-objects';

export const VISITOR_SPACE_TABS = (): TabProps[] => [
	{
		id: SearchPageMediaType.All,
		label: tText('modules/visitor-space/const/index___alles'),
	},
	{
		id: SearchPageMediaType.Video,
		icon: <Icon name={IconNamesLight.Video} aria-hidden />,
		label: tText('modules/visitor-space/const/index___videos'),
	},
	{
		id: SearchPageMediaType.Audio,
		icon: <Icon name={IconNamesLight.Audio} aria-hidden />,
		label: tText('modules/visitor-space/const/index___audio'),
	},
];