import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactElement, useEffect, useState } from 'react';

import { Icon, IconLightNames } from '@shared/components';
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
	isOpen = true,
	sortOptions = [],
	onMenuToggle,
}) => {
	console.log('isOpen', isOpen);

	const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [lockScroll, setLockScroll] = useState<boolean>(false);
	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();

	const isMobile = windowSize.width ? windowSize.width < Breakpoints.md : false;
	const openIcon: IconLightNames = isMobile ? 'filter' : isOpen ? 'angle-up' : 'angle-down';

	useScrollLock(isBrowser() ? document.body : null, lockScroll);

	useEffect(() => {
		if (!isMobile) {
			// Remove body scroll lock when leaving mobile
			if (lockScroll) {
				console.log('lock scroll effet');

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

	const onToggleClick = () => {
		console.log(isOpen);

		if (isOpen) {
			// Remove active filter when closing the menu
			setActiveFilter(null);
			console.log('closing');
			isMobile && setLockScroll(false);
		} else {
			console.log('opening');
			isMobile && setLockScroll(true);
		}

		if (typeof onMenuToggle === 'function') {
			onMenuToggle();
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
					onClick={onToggleClick}
				/>
				{!isMobile && (
					<div className={styles['c-filter-menu__view-toggle']}>
						{/* TODO: replace with Toggle component */}
						<Button
							icon={<Icon name="list-view" />}
							variants={['black', 'sm', 'text']}
						/>
						<Button
							icon={<Icon name="grid-view" />}
							variants={['black', 'sm', 'text']}
						/>
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
										) as any
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
			<FilterMenuMobile isOpen={isMobile && isOpen} />
		</div>
	);
};

export default FilterMenu;
