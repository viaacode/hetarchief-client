import { DynamicActionMenuProps } from '../components/DynamicActionMenu';

export const MEDIA_ACTIONS: DynamicActionMenuProps = {
	actions: [
		{
			label: 'quotes',
			iconName: 'quotes',
			id: 'quotes',
			ariaLabel: 'copies quotes',
			tooltip: 'quotes',
		},
		{
			label: 'description',
			iconName: 'description',
			id: 'description',
			ariaLabel: 'shows description',
			tooltip: 'description',
		},
		{
			label: 'bookmark',
			iconName: 'bookmark',
			id: 'bookmark',
			ariaLabel: 'bookmarks item',
			tooltip: 'bookmark',
		},
		{
			label: 'contact',
			iconName: 'contact',
			id: 'contact',
			ariaLabel: 'contact reading room',
			tooltip: 'contact',
		},
		{
			label: 'calendar',
			iconName: 'calendar',
			id: 'calendar',
			ariaLabel: 'copy date',
			tooltip: 'calandar',
		},
		{
			label: 'related-objects',
			iconName: 'related-objects',
			id: 'related-objects',
			ariaLabel: 'access related objects',
			tooltip: 'related',
		},
	],
	limit: 2,
	onClickAction: (id) => console.log(id),
};
