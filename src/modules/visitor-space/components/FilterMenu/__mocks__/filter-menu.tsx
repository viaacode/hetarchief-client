import { TagOption } from '@meemoo/react-components';

import { IconNamesLight } from '@shared/components';

import { VisitorSpaceSort } from '../../../types';
import { FilterMenuFilterOption, FilterMenuSortOption } from '../FilterMenu.types';

export const sortOptionsMock: FilterMenuSortOption[] = [
	{
		label: 'Relevantie',
		orderProp: VisitorSpaceSort.Relevance,
	},
];

export const filterOptionsMock: FilterMenuFilterOption[] = [
	{
		id: 'period',
		label: 'Periode',
		form: () => null,
	},
	{
		id: 'quality',
		label: 'Kwaliteit',
		form: () => null,
	},
	{
		id: 'source',
		label: 'Bron',
		form: () => null,
	},
	{
		id: 'rights',
		label: 'Rechten',
		form: () => null,
	},
	{
		id: 'advanced',
		label: 'Geavanceerd',
		icon: IconNamesLight.DotsHorizontal,
		form: () => null,
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
