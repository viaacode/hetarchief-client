import { DynamicActionMenuProps } from '../DynamicActionMenu.types';

export const dynamicActionMenuMock: DynamicActionMenuProps = {
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
			label: 'menu',
			iconName: 'menu',
			id: 'menu',
			ariaLabel: 'some label',
		},
		{
			label: 'grid-view',
			iconName: 'grid-view',
			id: 'grid-view',
			ariaLabel: 'some label',
		},
		{
			label: 'list-view',
			iconName: 'list-view',
			id: 'list-view',
			ariaLabel: 'some label',
		},
	],
	limit: 3,
	onClickAction: (id) => console.log(id),
};
