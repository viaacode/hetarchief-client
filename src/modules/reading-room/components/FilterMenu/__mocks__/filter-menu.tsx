import { TagOption } from '@meemoo/react-components';

import { ReadingRoomSort } from '@reading-room/types';

import { FilterMenuFilterOption, FilterMenuSortOption } from '../FilterMenu.types';

export const sortOptionsMock: FilterMenuSortOption[] = [
	{
		label: 'Relevantie',
		sort: ReadingRoomSort.Relevance,
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

export const filterTagsMock: TagOption[] = [
	{
		id: 'episode',
		label: (
			<span>
				Trefwoord: <strong>Episode 1</strong>
			</span>
		),
	},
];
