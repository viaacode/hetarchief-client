import { Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import { FC, useState } from 'react';

import { Overlay } from '@shared/components';
import { OrderDirection } from '@shared/types';

import { VisitorSpaceSort } from '../../../types';
import { FilterButton } from '../FilterButton';
import styles from '../FilterMenu.module.scss';
import { FilterSortList } from '../FilterSortList';

import { FilterSortProps } from './FilterSort.types';

const FilterSort: FC<FilterSortProps> = ({
	activeSort,
	activeSortLabel,
	options,
	onOptionClick,
}) => {
	const [sortOptionsOpen, setSortOptionsOpen] = useState(false);

	const onCloseDropdown = () => setSortOptionsOpen(false);

	const handleOptionClick = (key: VisitorSpaceSort, order?: OrderDirection) => {
		onOptionClick?.(key, order);
		setSortOptionsOpen(false);
	};

	return (
		<>
			<Dropdown
				className={styles['c-filter-menu__option']}
				flyoutClassName={styles['c-filter-menu__flyout']}
				isOpen={sortOptionsOpen}
				onOpen={() => setSortOptionsOpen(true)}
				onClose={onCloseDropdown}
			>
				<DropdownButton>
					<FilterButton
						icon={
							activeSort?.orderDirection === OrderDirection.desc
								? 'sort-down'
								: 'sort-up'
						}
						isActive={sortOptionsOpen}
						label={activeSortLabel}
						type="sort"
					/>
				</DropdownButton>
				<DropdownContent>
					<FilterSortList
						activeSort={activeSort}
						options={options}
						onOptionClick={handleOptionClick}
					/>
				</DropdownContent>
			</Dropdown>
			<Overlay
				className={styles['c-filter-menu__overlay']}
				visible={sortOptionsOpen}
				onClick={onCloseDropdown}
			/>
		</>
	);
};

export default FilterSort;
