import {
	Dropdown,
	DropdownButton,
	DropdownContent,
	OrderDirection,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useState } from 'react';

import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Overlay } from '@shared/components/Overlay';

import type { SearchSortProp } from '../../../types';
import { FilterButton } from '../FilterButton';
import styles from '../FilterMenu.module.scss';
import { FilterSortList } from '../FilterSortList';

import type { FilterSortProps } from './FilterSort.types';

const FilterSort: FC<FilterSortProps> = ({
	activeSort,
	activeSortLabel,
	options,
	onOptionClick,
	className,
}) => {
	const [sortOptionsOpen, setSortOptionsOpen] = useState(false);

	const onCloseDropdown = () => setSortOptionsOpen(false);

	const handleOptionClick = (key: SearchSortProp, order?: OrderDirection) => {
		onOptionClick?.(key, order);
		setSortOptionsOpen(false);
	};

	return (
		<>
			<Dropdown
				key={`dropdown-open--${sortOptionsOpen}`}
				className={styles['c-filter-menu__option']}
				flyoutClassName={clsx(className, styles['c-filter-menu__flyout'])}
				isOpen={sortOptionsOpen}
				onOpen={() => setSortOptionsOpen(true)}
				onClose={onCloseDropdown}
			>
				<DropdownButton>
					<FilterButton
						className={clsx(styles['c-filter-menu__button--sort-header'], {
							'u-bg-shade': !sortOptionsOpen,
						})}
						icon={
							activeSort?.orderDirection === OrderDirection.desc
								? IconNamesLight.SortDown
								: IconNamesLight.SortUp
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
