import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { Trans } from 'next-i18next';
import { FC, ReactElement, useEffect, useState } from 'react';

import { Icon, IconLightNames, Toggle } from '@shared/components';
import { useScrollLock, useWindowSizeContext } from '@shared/hooks';
import { Breakpoints } from '@shared/types';

import styles from './FilterMenu.module.scss';
import { FilterMenuFilterOption, FilterMenuProps } from './FilterMenu.types';
import { FilterMenuMobile } from './FilterMenuMobile';

const FilterMenu: FC<FilterMenuProps> = ({
	className,
	filters = [],
	label = 'Filters',
	isMobileOpen = false,
	isOpen = true,
	sortOptions = [],
	toggleOptions = [],
	onMenuToggle,
	onViewToggle = () => null,
}) => {
	const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [lockScroll, setLockScroll] = useState<boolean>(false);
	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();

	const isMobile = windowSize.width ? windowSize.width < Breakpoints.sm : false;
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
		setActiveFilter(filterId);
	};

	const onToggleClick = (nextOpen?: boolean) => {
		const openState = isMobile ? isMobileOpen : isOpen;

		if (openState) {
			// Remove active filter when closing the menu
			setActiveFilter(null);
		}
		if (typeof onMenuToggle === 'function') {
			onMenuToggle(nextOpen);
		}

		isMobile && setLockScroll(!openState);
	};

	/**
	 * Render
	 */

	const renderFilterButton = ({ icon, id, label }: FilterMenuFilterOption): ReactElement => {
		const filterIsActive = id === activeFilter;
		const filterBtnCls = clsx(styles['c-filter-menu__filter'], {
			[styles['c-filter-menu__filter--active']]: filterIsActive,
		});
		const iconName = filterIsActive ? 'angle-left' : icon ?? 'angle-right';

		return (
			<Button
				key={`filter-menu-btn-${id}`}
				className={filterBtnCls}
				iconEnd={<Icon name={iconName} />}
				label={label}
				variants={['black', 'block']}
				onClick={() => onFilterClick(id)}
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
						<Dropdown
							isOpen={sortOptionsOpen}
							onOpen={() => setSortOptionsOpen(true)}
							onClose={() => setSortOptionsOpen(false)}
						>
							<DropdownButton>
								<Button
									className={clsx(
										styles['c-filter-menu__filter']
										// TODO: additional styling
									)}
									variants={['black', 'block']}
									label={
										<Trans
											// TODO: adjust i18n:extract to preserve key
											i18nKey="modules/reading-room/components/filter-menu/filter-menu___sorteer-op"
											values={{ sorted: sortOptions[0].label }}
											defaults="Sorteer op: <strong>{{ sorted }}</strong>"
										/>
									}
								/>

								{/* TODO: sorting indicator */}
							</DropdownButton>
							<DropdownContent />
						</Dropdown>
					)}
					{filters.map(renderFilterButton)}
				</div>
			)}
			<FilterMenuMobile
				activeFilter={activeFilter}
				filters={filters}
				isOpen={isMobile && isMobileOpen}
				onClose={() => onToggleClick(false)}
				onFilterClick={onFilterClick}
			/>
		</div>
	);
};

export default FilterMenu;
