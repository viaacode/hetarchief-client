import { Button, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, ReactElement, useEffect, useState } from 'react';

import { Navigation } from '@navigation/components';
import { VisitorSpaceSort } from '@reading-room/types';
import { Icon } from '@shared/components';
import { OrderDirection } from '@shared/types';

import { FilterButton } from '../FilterButton';
import FilterForm from '../FilterForm/FilterForm';
import { FilterMenuFilterOption } from '../FilterMenu.types';
import { FilterSortList } from '../FilterSortList';

import styles from './FilterMenuMobile.module.scss';
import { FilterMenuMobileProps } from './FilterMenuMobile.types';

const FilterMenuMobile: FC<FilterMenuMobileProps> = ({
	activeFilter,
	activeSort,
	activeSortLabel,
	filters = [],
	isOpen,
	onClose,
	onFilterClick = () => null,
	onFilterReset,
	onFilterSubmit,
	onSortClick,
	showNavigationBorder,
	sortOptions = [],
	filterValues,
}) => {
	const [openedAt, setOpenedAt] = useState<number | undefined>(undefined);
	const [isSortActive, setIsSortActive] = useState(false);
	const { t } = useTranslation();

	// re-render form to ensure correct state
	// e.g. open -> reset -> close -> open === values in url, in form
	useEffect(() => {
		setOpenedAt(new Date().valueOf());
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	const selectedFilter = filters.find((filter) => filter.id === activeFilter);
	const showFilterOrSort = activeFilter || isSortActive;
	const showInitialScreen = !activeFilter && !isSortActive;
	const goBackToInitial = activeFilter
		? () => onFilterClick(activeFilter)
		: () => setIsSortActive(false);

	const handleSortClick = (key: VisitorSpaceSort, order?: OrderDirection) => {
		onSortClick?.(key, order);
		setIsSortActive(false);
	};

	// Render

	const renderFilterButton = ({ icon, id, label }: FilterMenuFilterOption): ReactElement => {
		const filterIsActive = id === activeFilter;

		return (
			<FilterButton
				key={`filter-menu-mobile-btn-${id}`}
				icon={filterIsActive ? 'angle-left' : icon ?? 'angle-right'}
				isActive={filterIsActive}
				label={label}
				onClick={() => onFilterClick(id)}
			/>
		);
	};

	return (
		<div
			className={clsx(styles['c-filter-menu-mobile'], {
				[styles['c-filter-menu-mobile--active']]: showFilterOrSort,
			})}
		>
			{showInitialScreen && (
				<>
					<Navigation
						className={styles['c-filter-menu-mobile__nav']}
						showBorder={showNavigationBorder}
					>
						<Button
							key="filter-menu-mobile-nav-close"
							className={styles['c-filter-menu-mobile__back']}
							iconStart={<Icon className="u-text-left" name="arrow-left" />}
							label={t(
								'modules/reading-room/components/filter-menu/filter-menu-mobile/filter-menu-mobile___zoekresultaten'
							)}
							variants={['text']}
							onClick={onClose}
						/>
					</Navigation>

					<div className="l-container">
						<h4 className="u-text-center u-mt-24">
							{t(
								'modules/reading-room/components/filter-menu/filter-menu-mobile/filter-menu-mobile___filters'
							)}
						</h4>

						<TagList
							closeIcon={<Icon className="u-text-left" name="times" />}
							onTagClosed={() => null}
							tags={[]}
							variants="large"
						/>
					</div>

					<div className={clsx(styles['c-filter-menu-mobile__filters'], 'u-mt-24')}>
						{sortOptions.length > 0 && (
							<FilterButton
								icon={
									activeSort?.orderDirection === OrderDirection.desc
										? 'sort-down'
										: 'sort-up'
								}
								isActive={isSortActive}
								label={activeSortLabel}
								type="sort"
								onClick={() => setIsSortActive(true)}
							/>
						)}
						{filters.map(renderFilterButton)}
					</div>
				</>
			)}
			{showFilterOrSort && (
				<>
					<Navigation
						className={styles['c-filter-menu-mobile__nav']}
						showBorder={showNavigationBorder}
					>
						<Button
							key="filter-menu-mobile-nav-filter"
							className={styles['c-filter-menu-mobile__back']}
							iconStart={<Icon className="u-text-left" name="arrow-left" />}
							label={t(
								'modules/reading-room/components/filter-menu/filter-menu-mobile/filter-menu-mobile___filters'
							)}
							variants={['text']}
							onClick={goBackToInitial}
						/>
					</Navigation>

					{activeFilter && selectedFilter && !isSortActive && (
						<FilterForm
							className={styles['c-filter-menu-mobile__form']}
							form={selectedFilter.form}
							id={selectedFilter.id}
							key={openedAt}
							onFormReset={onFilterReset}
							onFormSubmit={onFilterSubmit}
							title={selectedFilter.label}
							values={filterValues?.[selectedFilter.id]}
						/>
					)}
					{isSortActive && !activeFilter && (
						<>
							<h4 className="u-text-center u-mt-24 u-mb-16">
								{t(
									'modules/reading-room/components/filter-menu/filter-menu-mobile/filter-menu-mobile___sorteer-op'
								)}
							</h4>
							<FilterSortList
								activeSort={activeSort}
								options={sortOptions}
								onOptionClick={handleSortClick}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default FilterMenuMobile;
