import { ToggleProps } from '../Toggle.types';

export const toggleMock: ToggleProps = {
	options: [
		{
			id: 'grid',
			iconName: 'grid-view',
			active: true,
		},
		{
			id: 'list',
			iconName: 'list-view',
			active: false,
		},
	],
	onChange: (id) => console.log(id),
};
