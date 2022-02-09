import { Button } from '@meemoo/react-components';
import { FC } from 'react';

import { ListNavigation, ListNavigationItem } from '@shared/components';

import { FilterMenuSortOption } from '../FilterMenu.types';

import { FilterSortListProps } from './FilterSortList.types';

const FilterSortList: FC<FilterSortListProps> = ({ activeSort, options, onOptionClick }) => {
	const checkActiveSort = ({ sort, order }: FilterMenuSortOption) => {
		const isSortEqual = sort === activeSort?.sort;
		return !activeSort?.order ? isSortEqual : isSortEqual && order === activeSort.order;
	};

	const sortListItems: ListNavigationItem[] = options.map((option) => {
		const { label, sort, order } = option;
		return {
			id: `filter-sort-${sort}${order ? `-${order}` : ''}`,
			active: checkActiveSort(option),
			node: ({ buttonClassName }) => (
				<Button
					className={buttonClassName}
					label={label}
					variants={['text', 'block']}
					onClick={() => onOptionClick?.(sort, order)}
				/>
			),
		};
	});

	return <ListNavigation listItems={sortListItems} />;
};

export default FilterSortList;
