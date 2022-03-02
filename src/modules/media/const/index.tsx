import { DynamicActionMenuProps } from '../components/DynamicActionMenu';

export const MEDIA_ACTIONS: DynamicActionMenuProps = {
	actions: [
		{
			label: 'quotes',
			iconName: 'quotes',
			id: 'quotes',
			ariaLabel: 'copies quotes',
		},
		{
			label: 'description',
			iconName: 'description',
			id: 'description',
			ariaLabel: 'shows description',
		},
		{
			label: 'bookmark',
			iconName: 'bookmark',
			id: 'bookmark',
			ariaLabel: 'bookmarks item',
		},
		{
			label: 'contact',
			iconName: 'contact',
			id: 'contact',
			ariaLabel: 'contact reading room',
		},
		{
			label: 'calendar',
			iconName: 'calendar',
			id: 'calendar',
			ariaLabel: 'copy date',
		},
		{
			label: 'related-objects',
			iconName: 'related-objects',
			id: 'related-objects',
			ariaLabel: 'access related objects',
		},
	],
	limit: 2,
	onClickAction: (id) => console.log(id),
};
