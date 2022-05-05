import { MediaActions } from '@media/types';
import { Icon } from '@shared/components';

import { DynamicActionMenuProps } from '../DynamicActionMenu.types';

export const dynamicActionMenuMock: DynamicActionMenuProps = {
	actions: [
		{
			label: 'quotes',
			icon: <Icon name="quotes" />,
			id: MediaActions.Quotes,
			ariaLabel: 'copies quotes',
		},
		{
			label: 'description',
			icon: <Icon name="description" />,
			id: MediaActions.Description,
			ariaLabel: 'shows description',
		},
		{
			label: 'bookmark',
			icon: <Icon name="bookmark" />,
			id: MediaActions.Bookmark,
			ariaLabel: 'bookmarks item',
		},
		{
			label: 'contact',
			icon: <Icon name="contact" />,
			id: MediaActions.Contact,
			ariaLabel: 'contact reading room',
		},
		{
			label: 'calendar',
			icon: <Icon name="calendar" />,
			id: MediaActions.Calendar,
			ariaLabel: 'copy date',
		},
		{
			label: 'related-objects',
			icon: <Icon name="related-objects" />,
			id: MediaActions.RelatedObjects,
			ariaLabel: 'access related objects',
		},
	],
	limit: 2,
	onClickAction: (id) => console.log(id),
};
