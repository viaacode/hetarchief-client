import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { Trans } from 'next-i18next';
import { FC, useEffect, useState } from 'react';

import { READING_ROOM_ACTIVE_SORT_MAP } from '@reading-room/const';
import { ReadingRoomSort } from '@reading-room/types';
import { Icon, IconLightNames, Toggle } from '@shared/components';
import { useScrollLock, useWindowSizeContext } from '@shared/hooks';
import { Breakpoints } from '@shared/types';

import styles from './FilterMenu.module.scss';
import { FilterMenuProps } from './FilterMenu.types';
import { FilterMenuMobile } from './FilterMenuMobile';
import { FilterOption } from './FilterOption';
import { FilterSort } from './FilterSort';

const FilterMenu: FC<FilterMenuProps> = ({
	activeSort,
	className,
	filters = [],
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
}) => {
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [lockScroll, setLockScroll] = useState<boolean>(false);
	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();

	const isMobile = windowSize.width ? windowSize.width < Breakpoints.md : false;
	const openIcon: IconLightNames = isMobile ? 'filter' : isOpen ? 'angle-up' : 'angle-down';

	useScrollLock(lockScroll);

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
		const nextActive = filterId === activeFilter ? null : filterId;
		setActiveFilter(nextActive);
	};

	const onFilterFormReset = (id: string) => {
		setActiveFilter(null);
		onFilterReset(id);
	};

	const onFilterFormSubmit = (id: string, values: unknown) => {
		setActiveFilter(null);
		onFilterSubmit(id, values);
	};

	const onToggleClick = (nextOpen?: boolean) => {
		const openState = isMobile ? isMobileOpen : isOpen;

		if (openState) {
			// Remove active filter when closing the menu
			setActiveFilter(null);
		}

		onMenuToggle?.(nextOpen, isMobile);
		isMobile && setLockScroll(!openState);
	};

	/**
	 * Render
	 */

	const renderActiveSortLabel = () => {
		const sortBtnLabel = activeSort
			? READING_ROOM_ACTIVE_SORT_MAP()[activeSort.orderProp as ReadingRoomSort]
			: '';

		return (
			<Trans
				i18nKey="modules/reading-room/components/filter-menu/filter-menu___sorteer-op"
				values={{ sorted: sortBtnLabel }}
				defaults="Sorteer op: <strong>{{ sorted }}</strong>"
			/>
		);
	};

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
					{sortOptions.length > 0 && (
						<FilterSort
							activeSort={activeSort}
							activeSortLabel={renderActiveSortLabel()}
							className={styles['c-filter-menu__option']}
							options={sortOptions}
							onOptionClick={onSortClick}
						/>
					)}
					{filters.map((option) => (
						<FilterOption
							{...option}
							key={`filter-menu-option-${option.id}`}
							className={styles['c-filter-menu__option']}
							activeFilter={activeFilter}
							onClick={onFilterClick}
							onFormReset={onFilterFormReset}
							onFormSubmit={onFilterFormSubmit}
						/>
					))}
				</div>
			)}
			<FilterMenuMobile
				activeFilter={activeFilter}
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
			/>
		</div>
	);
};

export default FilterMenu;
