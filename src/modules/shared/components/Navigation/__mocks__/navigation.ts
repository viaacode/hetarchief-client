import { NavigationItem } from '../Navigation.types';

export const MOCK_ITEMS_LEFT: NavigationItem[][] = [
	[
		{
			href: '#',
			label: 'Leeszalen',
			id: 'leeszalen',
			isActive: true,
			badge: 2,
			dropdown: [
				[{ href: '#', label: 'Alle leeszalen', id: 'alle leeszalen' }],
				[
					{
						href: 'leeszaal/leeszaal-8',
						label: 'Leeszaal 8',
						iconEnd: 'angle-right',
						id: 'leeszaal 8',
					},
					{
						href: 'leeszaal/leeszaal-12',
						label: 'Leeszaal 12',
						iconEnd: 'angle-right',
						id: 'leeszaal 12',
					},
				],
			],
		},
		{
			href: '#',
			label: 'Over de leeszalen',
			id: 'over leeszalen',
		},
		{ href: '#', label: 'Vaak gestelde vragen', id: 'vragen' },
	],
	[{ href: '#', label: 'Admin', id: 'admin' }],
];

export const MOCK_ITEMS_RIGHT: NavigationItem[][] = [
	[
		{
			href: '#',
			label: 'Inloggen of registreren',
			id: 'auth',
			dropdown: [
				[
					{ href: '#', label: 'Mijn profiel', id: 'profiel' },
					{ href: '#', label: 'Mijn mappen', id: 'mappen' },
					{ href: '#', label: 'Mijn historiek', id: 'historiek' },
				],
				[{ href: '#', label: 'log uit', id: 'uitloggen', iconStart: 'log-out' }],
			],
		},
	],
];
