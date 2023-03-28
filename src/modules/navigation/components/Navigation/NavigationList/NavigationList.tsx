import { keysSpacebar, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useState } from 'react';

import { Icon, IconName, IconNamesLight, Overlay } from '@shared/components';

import styles from '../Navigation.module.scss';
import { NavigationItem } from '../Navigation.types';
import { NavigationDropdown } from '../NavigationDropdown';

import { NavigationListProps } from './NavigationList.types';

const NavigationList: FC<NavigationListProps> = ({ items, onOpenDropdowns }) => {
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	const openDropdowns = (id: string) => {
		setOpenDropdown(id);
		onOpenDropdowns?.();
	};

	const closeDropdowns = () => {
		setOpenDropdown(null);
	};

	const renderTrigger = (item: NavigationItem, iconName: IconName) => {
		return (
			<div
				className={clsx(styles['c-navigation__link--wrapper'], 'u-cursor-pointer')}
				onKeyDown={(e) => onKey(e, keysSpacebar, () => e.preventDefault())}
				role="button"
				tabIndex={0}
			>
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
						styles['c-navigation__link--border'],
						styles[`c-navigation__link--variant-${index + 1}`],
						{
							[styles['c-navigation__item--active']]:
								item.activeDesktop || item.activeMobile,
							[styles['c-navigation__item--divider']]: item.isDivider,
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
										openDropdown === item.id
											? IconNamesLight.AngleUp
											: IconNamesLight.AngleDown
									)}
									onClose={closeDropdowns}
									onOpen={openDropdowns}
								/>
							) : typeof item.node === 'function' ? (
								item.node({ closeDropdowns })
							) : (
								item.node
							)}
						</li>
					);
				})}
			</ul>
		</>
	);
};

export default NavigationList;
