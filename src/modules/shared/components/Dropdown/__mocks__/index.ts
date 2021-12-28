import { DropdownListProps } from '../DropdownList';

export const DropdownListMock: DropdownListProps = {
	listItems: [
		[
			{
				label: 'first item',
				icon: {
					name: 'trash',
				},
				onClick: () => console.log('click'),
			},
			{
				label: 'second item',
				icon: {
					name: 'trash',
				},
				onClick: () => console.log('click'),
			},
			{
				label: 'third item',
				icon: {
					name: 'trash',
				},
				onClick: () => console.log('click'),
			},
		],
		[
			{
				label: 'new list',
				icon: {
					name: 'trash',
				},
				onClick: () => console.log('click'),
			},
		],
	],
};
