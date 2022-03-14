import { MediaActions } from '@media/types';

import { DynamicActionMenuProps } from '../DynamicActionMenu.types';

export const dynamicActionMenuMock: DynamicActionMenuProps = {
	actions: [
		{
			label: 'quotes',
			iconName: 'quotes',
			id: MediaActions.Quotes,
			ariaLabel: 'copies quotes',
		},
		{
			label: 'description',
			iconName: 'description',
			id: MediaActions.Description,
			ariaLabel: 'shows description',
		},
		{
			label: 'bookmark',
			iconName: 'bookmark',
			id: MediaActions.Bookmark,
			ariaLabel: 'bookmarks item',
		},
		{
			label: 'contact',
			iconName: 'contact',
			id: MediaActions.Contact,
			ariaLabel: 'contact reading room',
		},
		{
			label: 'calendar',
			iconName: 'calendar',
			id: MediaActions.Calendar,
			ariaLabel: 'copy date',
		},
		{
			label: 'related-objects',
			iconName: 'related-objects',
			id: MediaActions.RelatedObjects,
			ariaLabel: 'access related objects',
		},
	],
	limit: 2,
	onClickAction: (id) => console.log(id),
};
