import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash-es';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { useQueryParams } from 'use-query-params';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Toggle } from '@shared/components/Toggle';
import { tText } from '@shared/helpers/translate';
import { useScrollLock } from '@shared/hooks/use-scroll-lock';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';
import FilterMenuMobile from '@visitor-space/components/FilterMenu/FilterMenuMobile/FilterMenuMobile';
import {
	SEARCH_PAGE_QUERY_PARAM_CONFIG,
	VISITOR_SPACE_ACTIVE_SORT_MAP,
} from '@visitor-space/const';

import type { SearchFilterId, SearchSortProp } from '../../types';

import styles from './FilterMenu.module.scss';
import type { FilterMenuFilterOption, FilterMenuProps } from './FilterMenu.types';
import { FilterOption } from './FilterOption';
import { FilterSort } from './FilterSort';

const FilterMenu: FC<FilterMenuProps> = ({
	activeSort,
	className,
	filters = [],
	filterValues,
	label,
	isMobileOpen = false,
	isOpen = true,
	sortOptions = [],
	toggleOptions = [],
	onFilterReset = () => null,
	onFilterSubmit = () => null,
	onMenuToggle,
	onSortClick,
	onViewToggle = () => null,
	onRemoveValue,
}) => {
	const [query, setQuery] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);

	const [lockScroll, setLockScroll] = useState<boolean>(false);
	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();

	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.lg);
	const openIcon = isMobile
		? IconNamesLight.Filter
		: isOpen
			? IconNamesLight.AngleUp
			: IconNamesLight.AngleDown;

	useScrollLock(lockScroll, 'FilterMenu');

	useEffect(() => {
		if (!isMobile) {
			// Remove body scroll lock when leaving mobile
			if (lockScroll) {
				setLockScroll(false);
			}
		}
	}, [isMobile, lockScroll]);

	/**
	 * Methods
	 */

	const onFilterClick = (filterId: string) => {
		const filter = filterId === query.filter ? undefined : filterId;
		setQuery({ filter });
	};

	const onFilterFormReset = (id: SearchFilterId) => {
		onFilterReset(id);
	};

	const onFilterFormSubmit = (id: SearchFilterId, values: unknown) => {
		onFilterSubmit(id, values);
	};

	const onToggleClick = (nextOpen?: boolean) => {
		const openState = isMobile ? isMobileOpen : isOpen;

		if (openState) {
			// Remove active filter when closing the menu
			setQuery({ filter: undefined });
		}

		onMenuToggle?.(nextOpen, isMobile);
		isMobile && setLockScroll(!openState);
	};

	/**
	 * Render
	 */

	const renderActiveSortLabel = () => {
		const sortBtnLabel = activeSort
			? VISITOR_SPACE_ACTIVE_SORT_MAP()[activeSort.orderProp as SearchSortProp]
			: '';

		return (
			<>
				{tText('modules/visitor-space/components/filter-menu/filter-menu___sorteer-op')}{' '}
				<strong>{sortBtnLabel}</strong>
			</>
		);
	};

	const renderFilterMenuSorting = (): ReactNode => (
		<FilterSort
			activeSort={activeSort}
			activeSortLabel={renderActiveSortLabel()}
			options={sortOptions}
			onOptionClick={onSortClick}
		/>
	);

	const renderFilterMenuOptions = (): ReactNode =>
		filters.map(
			(option: FilterMenuFilterOption): ReactNode => (
				<FilterOption
					{...option}
					key={`filter-menu-option-${option.id}`}
					className={clsx({
						[styles['c-filter-menu__option--operative']]: !isNil(filterValues?.[option?.id]),
					})}
					activeFilter={query.filter}
					values={filterValues?.[option.id]}
					onClick={onFilterClick}
					onFormReset={onFilterFormReset}
					onFormSubmit={onFilterFormSubmit}
				/>
			)
		);

	return (
		<div className={clsx(className, styles['c-filter-menu'])}>
			<div className={styles['c-filter-menu__header']}>
				<Button
					className={styles['c-filter-menu__toggle']}
					label={label}
					iconEnd={<Icon name={openIcon} />}
					variants="black"
					onClick={() => onToggleClick()}
				/>
				{!isMobile && (
					<div className={styles['c-filter-menu__view-toggle-container']}>
						<Toggle
							className={styles['c-filter-menu__view-toggle']}
							dark
							options={toggleOptions}
							onChange={onViewToggle}
						/>
					</div>
				)}
			</div>

			{isOpen && !isMobile && (
				<div className={styles['c-filter-menu__list']}>
					{!isEmpty(sortOptions) && renderFilterMenuSorting()}
					{renderFilterMenuOptions()}
				</div>
			)}

			<FilterMenuMobile
				activeFilter={query.filter}
				activeSort={activeSort}
				activeSortLabel={renderActiveSortLabel()}
				filters={filters}
				isOpen={isMobile && isMobileOpen}
				sortOptions={sortOptions}
				onClose={() => onToggleClick(false)}
				onFilterClick={onFilterClick}
				onSortClick={onSortClick}
				onFilterReset={onFilterFormReset}
				onFilterSubmit={onFilterFormSubmit}
				filterValues={filterValues}
				onRemoveValue={onRemoveValue}
			/>
		</div>
	);
};

export default FilterMenu;
