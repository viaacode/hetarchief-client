import { Button } from '@meemoo/react-components';
import { FC } from 'react';

import { ListNavigation, ListNavigationItem } from '@shared/components';

import { FilterMenuSortOption } from '../FilterMenu.types';

import { FilterSortListProps } from './FilterSortList.types';

const FilterSortList: FC<FilterSortListProps> = ({ activeSort, options, onOptionClick }) => {
	const checkActiveSort = ({ orderProp, orderDirection }: FilterMenuSortOption) => {
		const isSortEqual = orderProp === activeSort?.orderProp;
		return !activeSort?.orderDirection
			? isSortEqual
			: isSortEqual && orderDirection === activeSort.orderDirection;
	};

	const sortListItems: ListNavigationItem[] = options.map((option) => {
		const { label, orderProp, orderDirection } = option;
		return {
			id: `filter-sort-${orderProp}${orderDirection ? `-${orderDirection}` : ''}`,
			active: checkActiveSort(option),
			node: ({ buttonClassName }) => (
				<Button
					className={buttonClassName}
					label={label}
					variants={['text', 'block']}
					onClick={() => onOptionClick?.(orderProp, orderDirection)}
				/>
			),
		};
	});

	return <ListNavigation listItems={sortListItems} />;
};

export default FilterSortList;
