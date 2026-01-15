import { Button } from '@meemoo/react-components';
import { ListNavigation, type ListNavigationItem } from '@shared/components/ListNavigation';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import type { FC } from 'react';
import type { FilterMenuSortOption } from '../FilterMenu.types';
import type { FilterSortListProps } from './FilterSortList.types';

const FilterSortList: FC<FilterSortListProps> = ({ activeSort, options, onOptionClick }) => {
	const checkActiveSort = ({ orderProp, orderDirection }: FilterMenuSortOption) => {
		const isSortEqual = orderProp === activeSort?.orderProp;
		return (
			isSortEqual && (orderDirection || AvoSearchOrderDirection.DESC) === activeSort.orderDirection
		);
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
