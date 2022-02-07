import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { Trans } from 'next-i18next';
import { FC, useState } from 'react';

import { READING_ROOM_ACTIVE_SORT_MAP } from '@reading-room/const';
import { ReadingRoomSort } from '@reading-room/types';
import { Icon, ListNavigation, ListNavigationItem, Overlay } from '@shared/components';

import { FilterMenuSortOption } from '../FilterMenu.types';

import styles from './FilterSort.module.scss';
import { FilterSortProps } from './FilterSort.types';

const FilterSort: FC<FilterSortProps> = ({ activeSort, className, options, onOptionClick }) => {
	const [sortOptionsOpen, setSortOptionsOpen] = useState(false);

	const checkActiveSort = ({ sort, order }: FilterMenuSortOption) => {
		const isSortEqual = sort === activeSort?.sort;
		return !activeSort?.order ? isSortEqual : isSortEqual && order === activeSort.order;
	};

	const sortBtnLabel = activeSort
		? READING_ROOM_ACTIVE_SORT_MAP()[activeSort.sort as ReadingRoomSort]
		: '';
	const sortBtnCls = clsx(className, styles['c-filter-sort__button'], {
		[styles['c-filter-sort__button--active']]: sortOptionsOpen,
	});
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

	const onCloseDropdown = () => setSortOptionsOpen(false);

	return (
		<>
			<Dropdown
				className={styles['c-filter-sort']}
				flyoutClassName={styles['c-filter-sort__flyout']}
				isOpen={sortOptionsOpen}
				onOpen={() => setSortOptionsOpen(true)}
				onClose={onCloseDropdown}
			>
				<DropdownButton>
					<Button
						className={sortBtnCls}
						iconEnd={
							<Icon name={activeSort?.order === 'desc' ? 'sort-down' : 'sort-up'} />
						}
						label={
							<Trans
								// TODO: adjust i18n:extract to preserve key
								i18nKey="modules/reading-room/components/filter-menu/filter-menu___sorteer-op"
								values={{ sorted: sortBtnLabel }}
								defaults="Sorteer op: <strong>{{ sorted }}</strong>"
							/>
						}
						variants={['black', 'block']}
					/>
				</DropdownButton>
				<DropdownContent>
					<ListNavigation listItems={sortListItems} />
				</DropdownContent>
			</Dropdown>
			<Overlay
				className={styles['c-filter-sort__overlay']}
				visible={sortOptionsOpen}
				onClick={onCloseDropdown}
			/>
		</>
	);
};

export default FilterSort;
