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
	// A state-backed ref, since the fly-out only mounts client-side: the positioning effect below
	// has to re-run once the node actually exists, not just when the filter becomes active.
	const [flyoutEl, setFlyoutEl] = useState<HTMLDivElement | null>(null);

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

	// The fly-out sits against the right edge of the filter panel and grows upwards from the row
	// that opened it, so it stays visually connected to that row while leaving its content (a
	// dropdown, a long list) as much room as possible. Only the browser knows where the row sits
	// and how tall the fly-out turned out.
	useLayoutEffect(() => {
		if (!filterIsActive || !flyoutEl) {
			return;
		}

		const measure = (): void => {
			const row = optionRef.current?.getBoundingClientRect();
			// The rounded offsetHeight would leave the fly-out a pixel off from the row it hangs on
			const flyoutHeight = flyoutEl.getBoundingClientRect().height;

			if (!row) {
				return;
			}

			// A fly-out may be taller than the space above the row, or use the full window height,
			// in which case it sits flush against the window edges instead.
			const lowestTop = window.innerHeight - flyoutHeight;

			setFlyoutPosition({
				left: row.right,
				top: Math.max(0, Math.min(row.bottom - flyoutHeight, lowestTop)),
			});
		};

		measure();

		// The fly-out grows and shrinks with its content, e.g. a text filter gaining a condition
		const observer = new ResizeObserver(measure);
		observer.observe(flyoutEl);
		window.addEventListener('resize', measure);
		window.addEventListener('scroll', measure, true);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', measure);
			window.removeEventListener('scroll', measure, true);
		};
	}, [filterIsActive, flyoutEl]);

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
							ref={setFlyoutEl}
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
