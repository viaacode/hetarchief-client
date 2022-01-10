import { Icon } from '../../Icon';
import { ListNavigationProps } from '../ListNavigation.types';

export const listNavigationMock: ListNavigationProps = {
	listItems: [
		[
			{
				label: 'Favorieten',
				to: '/',
				active: true,
			},
			{
				label: 'Onderzoek Wereldoorlogen',
				to: '/',
				active: false,
			},
			{
				label: "Jaren '80",
				to: '/',
				active: false,
			},
			{
				label: '1000 zonnen',
				to: '/',
				active: false,
			},
			{
				label: 'De kampioenen',
				to: '/',
				active: false,
			},
		],
		[
			{
				label: 'Nieuwe map toevoegen',
				icon: <Icon name="plus" />,
				onClick: () => console.log('nieuwe map'),
			},
		],
	],
};
