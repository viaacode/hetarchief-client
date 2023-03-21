import { Button, OrderDirection, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { FC, ReactElement, useEffect, useState } from 'react';

import { Navigation } from '@navigation/components';
import { Icon, IconNamesLight } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { VisitorSpaceSort } from '../../../types';
import { mapFiltersToTags } from '../../../utils';
import { FilterButton } from '../FilterButton';
import FilterForm from '../FilterForm/FilterForm';
import { FilterMenuFilterOption, FilterMenuType } from '../FilterMenu.types';
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
	const showFilterModal = activeFilter && selectedFilter && !isSortActive;
	const goBackToInitial = activeFilter
		? () => onFilterClick(activeFilter)
		: () => setIsSortActive(false);
	const tags = filterValues ? mapFiltersToTags(filterValues) : [];

	const handleSortClick = (key: VisitorSpaceSort, order?: OrderDirection) => {
		onSortClick?.(key, order);
		setIsSortActive(false);
	};

	// Render
	const renderModalButton = ({ icon, id, label }: FilterMenuFilterOption): ReactElement => {
		const filterIsActive = id === activeFilter;

		return (
			<FilterButton
				key={`filter-menu-mobile-btn-${id}`}
				className={clsx(styles['c-filter-menu-mobile__option'], {
					[styles['c-filter-menu-mobile__option--operative']]: !isNil(filterValues?.[id]),
				})}
				icon={filterIsActive ? IconNamesLight.AngleLeft : icon ?? IconNamesLight.AngleRight}
				isActive={filterIsActive}
				label={label}
				onClick={() => onFilterClick(id)}
			/>
		);
	};

	const renderFilterModalHeader = (): ReactElement => (
		<Navigation
			className={styles['c-filter-menu-mobile__nav']}
			showBorder={showNavigationBorder}
		>
			<Button
				key="filter-menu-mobile-nav-filter"
				className={styles['c-filter-menu-mobile__back']}
				iconStart={<Icon className="u-text-left" name={IconNamesLight.ArrowLeft} />}
				label={tHtml(
					'modules/visitor-space/components/filter-menu/filter-menu-mobile/filter-menu-mobile___filters'
				)}
				variants={['text']}
				onClick={goBackToInitial}
			/>
		</Navigation>
	);

	const renderFilterHeader = (): ReactElement => (
		<Navigation
			className={styles['c-filter-menu-mobile__nav']}
			showBorder={showNavigationBorder}
		>
			<Button
				key="filter-menu-mobile-nav-close"
				className={styles['c-filter-menu-mobile__back']}
				iconStart={<Icon className="u-text-left" name={IconNamesLight.ArrowLeft} />}
				label={tHtml(
					'modules/visitor-space/components/filter-menu/filter-menu-mobile/filter-menu-mobile___zoekresultaten'
				)}
				variants={['text']}
				onClick={onClose}
			/>
		</Navigation>
	);

	const renderTagList = (): ReactElement => (
		<div className="l-container">
			<h4 className="u-text-center u-mt-24">
				{tHtml(
					'modules/visitor-space/components/filter-menu/filter-menu-mobile/filter-menu-mobile___filters'
				)}
			</h4>

			<TagList
				className={clsx(styles['c-filter-menu-mobile__tags'], 'u-mb-0')}
				closeIcon={<Icon className="u-text-left" name={IconNamesLight.Times} />}
				onTagClosed={(id) => onRemoveValue?.(tags.filter((tag) => tag.id !== id))}
				tags={tags}
				variants="large"
			/>
		</div>
	);

	const renderSortModal = (): ReactElement => (
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
	);

	const renderFormModal = (
		{ form, id, label, type }: FilterMenuFilterOption,
		isInline?: boolean
	): ReactElement => (
		<FilterForm
			className={clsx(styles['c-filter-menu-mobile__form'], {
				[styles['c-filter-menu-mobile--inline']]: isInline,
				[styles['c-filter-menu-mobile__option']]: isInline,
				[styles['c-filter-menu-mobile__option--operative']]:
					!isNil(filterValues?.[id]) && isInline,
			})}
			form={form}
			id={id}
			key={openedAt}
			onFormReset={onFilterReset}
			onFormSubmit={onFilterSubmit}
			title={label}
			values={filterValues?.[id]}
			type={type}
		/>
	);

	const renderFilterFormByType = (filterOption: FilterMenuFilterOption): ReactElement => {
		switch (filterOption.type) {
			case FilterMenuType.Modal:
				return renderModalButton(filterOption);
			case FilterMenuType.Checkbox:
				return renderFormModal(filterOption, true);
			default:
				return <></>;
		}
	};

	return (
		<div
			className={clsx(styles['c-filter-menu-mobile'], {
				[styles['c-filter-menu-mobile--active']]: showFilterOrSort,
			})}
		>
			{showInitialScreen && (
				<>
					{renderFilterHeader()}
					{renderTagList()}

					<div className={clsx(styles['c-filter-menu-mobile__filters'], 'u-mt-24')}>
						{sortOptions.length > 0 && (
							<FilterButton
								icon={
									activeSort?.orderDirection === OrderDirection.desc
										? IconNamesLight.SortDown
										: IconNamesLight.SortUp
								}
								isActive={isSortActive}
								label={activeSortLabel}
								type="sort"
								onClick={() => setIsSortActive(true)}
							/>
						)}

						{filters.map(renderFilterFormByType)}
					</div>
				</>
			)}

			{showFilterOrSort && (
				<>
					{renderFilterModalHeader()}
					{showFilterModal && renderFormModal(selectedFilter)}
					{isSortActive && !activeFilter && renderSortModal()}
				</>
			)}
		</div>
	);
};

export default FilterMenuMobile;
