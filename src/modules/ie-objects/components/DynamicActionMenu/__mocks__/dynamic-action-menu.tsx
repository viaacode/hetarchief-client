import { MediaActions } from '@ie-objects/ie-objects.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

import { type DynamicActionMenuProps } from '../DynamicActionMenu.types';

export const dynamicActionMenuMock: DynamicActionMenuProps = {
	actions: [
		{
			label: 'quotes',
			icon: <Icon name={IconNamesLight.Quotes} />,
			id: MediaActions.Quotes,
			ariaLabel: 'copies quotes',
		},
		{
			label: 'description',
			icon: <Icon name={IconNamesLight.Description} />,
			id: MediaActions.Description,
			ariaLabel: 'shows description',
		},
		{
			label: 'bookmark',
			icon: <Icon name={IconNamesLight.Bookmark} />,
			id: MediaActions.Bookmark,
			ariaLabel: 'bookmarks item',
		},
		{
			label: 'contact',
			icon: <Icon name={IconNamesLight.Contact} />,
			id: MediaActions.Contact,
			ariaLabel: 'contact reading room',
		},
		{
			label: 'calendar',
			icon: <Icon name={IconNamesLight.Calendar} />,
			id: MediaActions.Calendar,
			ariaLabel: 'copy date',
		},
		{
			label: 'related-objects',
			icon: <Icon name={IconNamesLight.RelatedObjects} />,
			id: MediaActions.RelatedObjects,
			ariaLabel: 'access related objects',
		},
	],
	limit: 2,
	onClickAction: (id) => console.info(id),
};
