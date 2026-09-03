import { Button, keysEscape } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Overlay } from '@shared/components/Overlay';
import { tText } from '@shared/helpers/translate';
import { AdvancedFilterFlyout } from '@visitor-space/components/AdvancedFilterFlyout/AdvancedFilterFlyout';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import { FilterModalType, SearchFilterId } from '@visitor-space/types';
import clsx from 'clsx';
import { type FC, type ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import { FilterButton } from '../FilterButton';
import FilterForm from '../FilterForm/FilterForm';
import styles from '../FilterMenu.module.scss';
import { FilterMenuType } from '../FilterMenu.types';

import type { FilterOptionProps } from './FilterOption.types';

const FilterOption: FC<FilterOptionProps> = ({
	activeFilter,
	filter,
	onClick,
	onFormReset,
	onFormSubmit,
	values,
	className,
	flyoutFilters = [],
	onFlyoutFilterClick,
}) => {
	const { icon, id, label, type } = filter;
	const filterIsActive = id === activeFilter;
	const isAdvancedFlyout = id === SearchFilterId.Advanced;

	// The redesigned modals are centred in the window. The date and duration filters keep the
	// position they had, since the FA of ARC-3806 leaves them as they are.
	const isCentred = isAdvancedFlyout || filter.modalType !== FilterModalType.Unchanged;

	const onFilterToggle = useCallback(() => onClick?.(id), [id, onClick]);
	const [openedAt, setOpenedAt] = useState<number | undefined>(undefined);
	const [flyoutLeft, setFlyoutLeft] = useState<number | undefined>(undefined);
	const optionRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-render form to ensure correct state,  e.g. open -> reset -> close -> open === values in url, in form
	useEffect(() => {
		setOpenedAt(Date.now());
	}, [filterIsActive]);

	// The fly-out has no close CTA in the design, so escape is the way out of it
	const closeFlyoutOnEscape = useCallback(
		(event: KeyboardEvent) => {
			if (isAdvancedFlyout && filterIsActive && keysEscape.includes(event.key)) {
				onFilterToggle();
			}
		},
		[isAdvancedFlyout, filterIsActive, onFilterToggle]
	);

	useEffect(() => {
		document.addEventListener('keydown', closeFlyoutOnEscape, false);

		return () => {
			document.removeEventListener('keydown', closeFlyoutOnEscape, false);
		};
	}, [closeFlyoutOnEscape]);

	// A centred fly-out needs the right edge of the panel in window coordinates to sit against
	useEffect(() => {
		if (!isCentred || !filterIsActive) {
			return;
		}

		const measure = (): void => {
			const right = optionRef.current?.getBoundingClientRect().right;

			if (right !== undefined) {
				setFlyoutLeft(right);
			}
		};

		measure();
		window.addEventListener('resize', measure);

		return () => {
			window.removeEventListener('resize', measure);
		};
	}, [isCentred, filterIsActive]);

	const renderFilterOptionByType = (): ReactElement => {
		switch (type) {
			case FilterMenuType.Modal:
				return renderModal();
			case FilterMenuType.Checkbox:
				return renderCheckbox();
			default:
				// biome-ignore lint/complexity/noUselessFragments: We want to have a ReactElement
				return <></>;
		}
	};

	const renderFilterForm = (cs: string, isInline?: boolean): ReactElement => (
		<FilterForm
			className={clsx(styles['c-filter-menu__option'], cs, {
				[`${className}`]: isInline,
			})}
			filter={filter}
			key={openedAt}
			onFormReset={onFormReset}
			onFormSubmit={onFormSubmit}
			title={label}
			values={values}
			disabled={!filterIsActive}
		/>
	);

	const renderCheckbox = (): ReactElement => renderFilterForm('c-filter-menu__form--inline', true);

	/** Only the filters the FA leaves as they are still hang from their own row. */
	const FILTER_MENU_HEIGHTS: Partial<Record<SearchFilterId, string>> = {
		[SearchFilterId.ReleaseDate]: '61.3rem',
		[SearchFilterId.Duration]: '48.1rem',
	};

	const renderModal = (): ReactElement => {
		return (
			<>
				<div
					className={clsx(styles['c-filter-menu__option'], className)}
					id={`c-filter-menu__option__${id}`}
					key={`filter-menu-btn-${id}`}
					ref={optionRef}
					style={{
						position: 'relative',
					}}
				>
					<FilterButton
						icon={filterIsActive ? IconNamesLight.AngleLeft : (icon ?? IconNamesLight.AngleRight)}
						isActive={filterIsActive}
						label={label}
						onClick={() => onClick?.(id)}
					/>

					<NoServerSideRendering>
						<div
							style={{
								backgroundColor: 'white',
								zIndex: 5,
								// A centred fly-out sits against the right edge of the panel, in the middle of
								// the window. The list of advanced filters is narrower than a filter modal.
								...(isCentred
									? {
											position: 'fixed',
											left: flyoutLeft,
											top: '50%',
											transform: 'translateY(-50%)',
											width: isAdvancedFlyout ? '30rem' : '46.4rem',
										}
									: {
											position: 'absolute',
											left: '100%',
											width: '46.4rem',
											top: `calc(-${FILTER_MENU_HEIGHTS[id] ?? '40rem'} / 2 + 2rem)`,
										}),
								display:
									filterIsActive && (!isCentred || flyoutLeft !== undefined) ? 'block' : 'none',
							}}
						>
							{/* The fly-out closes with escape or by clicking away, so it has no close CTA */}
							{!isAdvancedFlyout && (
								<Button
									className={styles['c-filter-menu__flyout-close']}
									icon={<Icon name={IconNamesLight.Times} aria-hidden />}
									ariaLabel={tText(
										'modules/visitor-space/components/filter-menu/filter-option/filter-option___sluiten'
									)}
									onClick={onFilterToggle}
									variants="text"
								/>
							)}
							{isAdvancedFlyout ? (
								<AdvancedFilterFlyout
									filters={flyoutFilters}
									onFilterClick={(filterId) => onFlyoutFilterClick?.(filterId)}
								/>
							) : (
								renderFilterForm('c-filter-menu__form')
							)}
						</div>
					</NoServerSideRendering>
				</div>
				<Overlay
					className={styles['c-filter-menu__overlay']}
					visible={filterIsActive}
					onClick={onFilterToggle}
				/>
			</>
		);
	};

	return renderFilterOptionByType();
};

export default FilterOption;
