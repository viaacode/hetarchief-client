import type { TabProps } from '@meemoo/react-components';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { SearchPageMediaType } from '@shared/types/ie-objects';

export const SEARCH_PAGE_IE_OBJECT_TABS = (): (TabProps & { showCountOnMobile?: boolean })[] => [
	{
		id: SearchPageMediaType.All,
		label: tText('modules/visitor-space/const/index___alles'),
		showCountOnMobile: true,
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
	{
		id: SearchPageMediaType.Newspaper,
		icon: <Icon name={IconNamesLight.Newspaper} aria-hidden />,
		label: tText('modules/visitor-space/const/visitor-space-tabs___krant'),
	},
];
