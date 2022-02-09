import { DynamicActionMenuProps } from '../DynamicActionMenu.types';

export const dynamicActionMenuMock: DynamicActionMenuProps = {
	actions: [
		{
			label: 'quotes',
			iconName: 'quotes',
			id: 'quotes',
		},
		{
			label: 'description',
			iconName: 'description',
			id: 'description',
		},
		{
			label: 'bookmark',
			iconName: 'bookmark',
			id: 'bookmark',
		},
		{
			label: 'menu',
			iconName: 'menu',
			id: 'menu',
		},
		{
			label: 'grid-view',
			iconName: 'grid-view',
			id: 'grid-view',
		},
		{
			label: 'list-view',
			iconName: 'list-view',
			id: 'list-view',
		},
	],
	limit: 3,
	onClickAction: (id) => console.log(id),
};
