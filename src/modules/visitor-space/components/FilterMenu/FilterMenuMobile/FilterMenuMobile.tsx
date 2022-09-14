import { Button, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactElement, useEffect, useState } from 'react';

import { Navigation } from '@navigation/components';
import { Icon } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { OrderDirection } from '@shared/types';

import { VisitorSpaceSort } from '../../../types';
import { mapFiltersToTags } from '../../../utils';
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
	onRemoveValue,
	showNavigationBorder,
	sortOptions = [],
	filterValues,
}) => {
	const [openedAt, setOpenedAt] = useState<number | undefined>(undefined);
	const [isSortActive, setIsSortActive] = useState(false);
	const { tHtml } = useTranslation();

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
	const tags = filterValues ? mapFiltersToTags(filterValues) : [];

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
							label={tHtml(
								'modules/visitor-space/components/filter-menu/filter-menu-mobile/filter-menu-mobile___zoekresultaten'
							)}
							variants={['text']}
							onClick={onClose}
						/>
					</Navigation>

					<div className="l-container">
						<h4 className="u-text-center u-mt-24">
							{tHtml(
								'modules/visitor-space/components/filter-menu/filter-menu-mobile/filter-menu-mobile___filters'
							)}
						</h4>

						<TagList
							className={clsx(styles['c-filter-menu-mobile__tags'], 'u-mb-0')}
							closeIcon={<Icon className="u-text-left" name="times" />}
							onTagClosed={(id) =>
								onRemoveValue?.(tags.filter((tag) => tag.id !== id))
							}
							tags={tags}
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
							label={tHtml(
								'modules/visitor-space/components/filter-menu/filter-menu-mobile/filter-menu-mobile___filters'
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
								{tHtml(
									'modules/visitor-space/components/filter-menu/filter-menu-mobile/filter-menu-mobile___sorteer-op'
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
