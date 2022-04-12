import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Icon, IconLightNames, Overlay } from '@shared/components';
import { selectHistory } from '@shared/store/history';

import styles from '../Navigation.module.scss';
import { NavigationItem } from '../Navigation.types';
import { NavigationDropdown } from '../NavigationDropdown';

import { NavigationListProps } from './NavigationList.types';

const NavigationList: FC<NavigationListProps> = ({ currentPath = '', items, onOpenDropdowns }) => {
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const history = useSelector(selectHistory);

	// Close dropdowns when the url path changed
	useEffect(() => {
		if (history[1] !== currentPath && openDropdown) {
			setOpenDropdown(null);
		}
	}, [history, currentPath, openDropdown]);

	const openDropdowns = (id: string) => {
		setOpenDropdown(id);
		onOpenDropdowns?.();
	};

	const closeDropdowns = () => {
		setOpenDropdown(null);
	};

	const renderTrigger = (item: NavigationItem, iconName: IconLightNames) => {
		return (
			<div className={clsx(styles['c-navigation__link--wrapper'], 'u-cursor-pointer')}>
				{item.node}
				<Icon className="u-text-left u-ml-4" name={iconName} />
			</div>
		);
	};

	return (
		<>
			<Overlay
				visible={!!openDropdown}
				className={clsx(
					styles['c-navigation__dropdown-overlay'],
					styles['c-navigation__list-overlay']
				)}
			/>
			<ul className={styles['c-navigation__list']}>
				{items.map((item, index) => {
					const itemCls = clsx(
						styles['c-navigation__item'],
						styles[`c-navigation__link--variant-${index + 1}`],
						{
							[styles['c-navigation__item--active']]: item.active,
							[styles['c-navigation__item--divider']]: item.hasDivider,
						}
					);

					return (
						<li key={`navigation-item-${item.id}`} className={itemCls}>
							{item.children?.length ? (
								<NavigationDropdown
									flyoutClassName={styles['c-navigation__list-flyout']}
									id={item.id}
									isOpen={openDropdown === item.id}
									lockScroll={openDropdown === item.id}
									items={item.children}
									trigger={renderTrigger(
										item,
										openDropdown === item.id ? 'angle-up' : 'angle-down'
									)}
									onClose={closeDropdowns}
									onOpen={openDropdowns}
								/>
							) : typeof item.node === 'function' ? (
								item.node({ closeDropdowns })
							) : (
								item.node
							)}
							{item.active && (
								<>
									<span className={styles['c-navigation__border-decoration']} />
									<span className={styles['c-navigation__border-decoration']} />
								</>
							)}
						</li>
					);
				})}
			</ul>
		</>
	);
};

export default NavigationList;
