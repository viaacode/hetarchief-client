import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactElement, useEffect, useState } from 'react';

import { Icon, IconLightNames, Toggle } from '@shared/components';
import { useScrollLock, useWindowSizeContext } from '@shared/hooks';
import { Breakpoints } from '@shared/types';
import { isBrowser } from '@shared/utils';

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

	useScrollLock(isBrowser() ? document.body : null, lockScroll);

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
			isMobile && setLockScroll(false);
		} else {
			isMobile && setLockScroll(true);
		}

		if (typeof onMenuToggle === 'function') {
			onMenuToggle(nextOpen);
		}
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
					<div className={styles['c-filter-menu__view-toggle']}>
						<Toggle options={toggleOptions} onChange={onViewToggle} />
					</div>
				)}
			</div>
			{isOpen && !isMobile && (
				<div className={styles['c-filter-menu__list']}>
					{sortOptions.length > 0 && (
						<Dropdown isOpen={sortOptionsOpen}>
							<DropdownButton>
								<Button
									label={
										(
											<span>
												Sorteer op: <strong>{}</strong>
											</span>
										) as any // eslint-disable-line @typescript-eslint/no-explicit-any
									}
									onClick={() => setSortOptionsOpen(true)}
								/>
							</DropdownButton>
							<DropdownContent />
						</Dropdown>
					)}
					{filters.map(renderFilterButton)}
				</div>
			)}
			<FilterMenuMobile
				isOpen={isMobile && isMobileOpen}
				onClose={() => onToggleClick(false)}
			/>
		</div>
	);
};

export default FilterMenu;
