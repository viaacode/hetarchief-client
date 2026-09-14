import { Button, keysEscape } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Overlay } from '@shared/components/Overlay';
import { tText } from '@shared/helpers/translate';
import { AdvancedFilterFlyout } from '@visitor-space/components/AdvancedFilterFlyout/AdvancedFilterFlyout';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import { SearchFilterId } from '@visitor-space/types';
import clsx from 'clsx';
import {
	type FC,
	type ReactElement,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';

import { FilterButton } from '../FilterButton';
import FilterForm from '../FilterForm/FilterForm';
import styles from '../FilterMenu.module.scss';
import { FilterMenuType } from '../FilterMenu.types';

import type { FilterOptionProps } from './FilterOption.types';

interface FlyoutPosition {
	left: number;
	top: number;
}

/** Matches the max-height of the fly-out panel, so a clamped fly-out keeps clear of both edges. */
const FLYOUT_SCREEN_EDGE_MARGIN = 40;

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

	const onFilterToggle = useCallback(() => onClick?.(id), [id, onClick]);
	const [openedAt, setOpenedAt] = useState<number | undefined>(undefined);
	const [flyoutPosition, setFlyoutPosition] = useState<FlyoutPosition | undefined>(undefined);
	const optionRef = useRef<HTMLDivElement>(null);
	const flyoutRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-render form to ensure correct state,  e.g. open -> reset -> close -> open === values in url, in form
	useEffect(() => {
		setOpenedAt(Date.now());
	}, [filterIsActive]);

	const closeFlyoutOnEscape = useCallback(
		(event: KeyboardEvent) => {
			if (filterIsActive && keysEscape.includes(event.key)) {
				onFilterToggle();
			}
		},
		[filterIsActive, onFilterToggle]
	);

	useEffect(() => {
		document.addEventListener('keydown', closeFlyoutOnEscape, false);

		return () => {
			document.removeEventListener('keydown', closeFlyoutOnEscape, false);
		};
	}, [closeFlyoutOnEscape]);

	// The fly-out hangs from the row that opened it, against the right edge of the filter panel.
	// Only the browser knows where that row sits and how tall the fly-out turned out.
	useLayoutEffect(() => {
		if (!filterIsActive) {
			return;
		}

		const measure = (): void => {
			const row = optionRef.current?.getBoundingClientRect();
			const flyoutHeight = flyoutRef.current?.offsetHeight;

			if (!row || flyoutHeight === undefined) {
				return;
			}

			const lowestTop = window.innerHeight - flyoutHeight - FLYOUT_SCREEN_EDGE_MARGIN;

			setFlyoutPosition({
				left: row.right,
				top: Math.max(FLYOUT_SCREEN_EDGE_MARGIN, Math.min(row.top, lowestTop)),
			});
		};

		measure();

		// The fly-out grows and shrinks with its content, e.g. a text filter gaining a condition
		const observer = new ResizeObserver(measure);
		if (flyoutRef.current) {
			observer.observe(flyoutRef.current);
		}
		window.addEventListener('resize', measure);
		window.addEventListener('scroll', measure, true);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', measure);
			window.removeEventListener('scroll', measure, true);
		};
	}, [filterIsActive]);

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

	const renderModal = (): ReactElement => {
		return (
			<>
				<div
					className={clsx(styles['c-filter-menu__option'], className)}
					id={`c-filter-menu__option__${id}`}
					key={`filter-menu-btn-${id}`}
					ref={optionRef}
				>
					<FilterButton
						icon={filterIsActive ? IconNamesLight.AngleLeft : (icon ?? IconNamesLight.AngleRight)}
						isActive={filterIsActive}
						label={label}
						onClick={() => onClick?.(id)}
					/>

					<NoServerSideRendering>
						<div
							ref={flyoutRef}
							className={clsx(styles['c-filter-menu__flyout-panel'], {
								[styles['c-filter-menu__flyout-panel--narrow']]: isAdvancedFlyout,
								[styles['c-filter-menu__flyout-panel--visible']]: filterIsActive,
							})}
							style={flyoutPosition}
						>
							{/* The advanced fly-out closes with escape or by clicking away, so it has no CTA */}
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
