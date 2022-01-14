import { FilterMenuFilterOption, FilterMenuSortOption } from '..';

export const sortOptionsMock: FilterMenuSortOption[] = [
	{
		label: 'Relevantie',
	},
];

export const filterOptionsMock: FilterMenuFilterOption[] = [
	{
		id: 'period',
		label: 'Periode',
	},
	{
		id: 'quality',
		label: 'Kwaliteit',
	},
	{
		id: 'source',
		label: 'Bron',
	},
	{
		id: 'rights',
		label: 'Rechten',
	},
	{
		id: 'advanced',
		label: 'Geavanceerd',
		icon: 'dots-horizontal',
	},
];
