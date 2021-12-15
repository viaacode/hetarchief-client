import { NavigationItem } from '../Navigation.types';

export const MOCK_ITEMS_LEFT: NavigationItem[][] = [
	[
		{ href: '#', label: 'Leeszalen', isActive: true },
		{ href: '#', label: 'Over de leeszalen' },
		{ href: '#', label: 'Vaak gestelde vragen' },
	],
	[{ href: '#', label: 'Admin' }],
];

export const MOCK_ITEMS_RIGHT: NavigationItem[][] = [
	[{ href: '#', label: 'Inloggen of registreren' }],
];
