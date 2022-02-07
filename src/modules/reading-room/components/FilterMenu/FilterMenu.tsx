import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { Trans } from 'next-i18next';
import { FC, useEffect, useState } from 'react';

import { Icon, IconLightNames, Toggle } from '@shared/components';
import { useScrollLock, useWindowSizeContext } from '@shared/hooks';
import { Breakpoints } from '@shared/types';

import styles from './FilterMenu.module.scss';
import { FilterMenuProps } from './FilterMenu.types';
import { FilterMenuMobile } from './FilterMenuMobile';
import { FilterOption } from './FilterOption';

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
					{filters.map((option) => (
						<FilterOption
							key={`filter-menu-option-${option.id}`}
							className={styles['c-filter-menu__option']}
							{...option}
							activeFilter={activeFilter}
							onClick={onFilterClick}
						/>
					))}
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
