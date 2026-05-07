import type { TabProps } from '@meemoo/react-components';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { SearchPageMediaType } from '@shared/types/ie-objects';

export const SEARCH_PAGE_IE_OBJECT_TABS = (): TabProps[] => [
	{
		id: SearchPageMediaType.All,
		label: tText('modules/visitor-space/const/index___alles'),
		ariaLabel: tText('modules/visitor-space/const/index___alles-aria-label'),
	},
	{
		id: SearchPageMediaType.Video,
		icon: <Icon name={IconNamesLight.Video} aria-hidden />,
		label: tText('modules/visitor-space/const/index___videos'),
		ariaLabel: tText('modules/visitor-space/const/index___videos-aria-label'),
	},
	{
		id: SearchPageMediaType.Audio,
		icon: <Icon name={IconNamesLight.Audio} aria-hidden />,
		label: tText('modules/visitor-space/const/index___audio'),
		ariaLabel: tText('modules/visitor-space/const/index___audio-aria-label'),
	},
	{
		id: SearchPageMediaType.Newspaper,
		icon: <Icon name={IconNamesLight.Newspaper} aria-hidden />,
		label: tText('modules/visitor-space/const/visitor-space-tabs___krant'),
		ariaLabel: tText('modules/visitor-space/const/visitor-space-tabs___krant-aria-label'),
	},
];
