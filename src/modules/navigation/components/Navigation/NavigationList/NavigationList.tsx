import { keysSpacebar, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { NavigationItem } from '@navigation/components/Navigation/NavigationSection/NavigationSection.types';
import { Icon, type IconName } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Overlay } from '@shared/components/Overlay';
import {
	selectOpenNavigationDropdownId,
	setOpenNavigationDropdownId,
	setShowMaterialRequestCenter,
	setShowNotificationsCenter,
} from '@shared/store/ui';

import styles from '../Navigation.module.scss';
import { NavigationDropdown } from '../NavigationDropdown';

import type { NavigationListProps } from './NavigationList.types';

const NavigationList: FC<NavigationListProps> = ({ items, onOpenDropdowns }) => {
	const dispatch = useDispatch();

	const openDropdownId = useSelector(selectOpenNavigationDropdownId);
	const setOpenDropdownId = (id: string | null) => {
		dispatch(setShowMaterialRequestCenter(false));
		dispatch(setShowNotificationsCenter(false));
		setTimeout(() => {
			dispatch(setOpenNavigationDropdownId(id));
		}, 10);
	};

	const openDropdowns = (id: string) => {
		setOpenDropdownId(id);
		onOpenDropdowns?.();
	};

	const closeDropdowns = () => {
		setOpenDropdownId(null);
	};

	const renderTrigger = (item: NavigationItem, iconName: IconName) => {
		return (
			<div
				className={clsx(styles['c-navigation__link--wrapper'], 'u-cursor-pointer')}
				onKeyDown={(e) => onKey(e, keysSpacebar, () => e.preventDefault())}
				// biome-ignore lint/a11y/useSemanticElements: <explanation>
				role="button"
				tabIndex={0}
			>
				{typeof item.node === 'function' ? item.node({ closeDropdowns }) : item.node}
				<Icon className="u-text-left u-ml-4" name={iconName} />
			</div>
		);
	};

	return (
		<>
			<Overlay
				visible={!!openDropdownId}
				className={clsx(
					styles['c-navigation__dropdown-overlay'],
					styles['c-navigation__list-overlay']
				)}
				onClick={closeDropdowns}
			/>
			<ul className={styles['c-navigation__list']}>
				{items.map((item, index) => {
					const itemCls = clsx(
						styles['c-navigation__item'],
						styles['c-navigation__link--border'],
						styles[`c-navigation__link--variant-${index + 1}`],
						{
							[styles['c-navigation__item--active']]: item.activeDesktop || item.activeMobile,
							[styles['c-navigation__item--divider']]: item.isDivider,
						}
					);

					return (
						<li key={`navigation-item-${item.id}`} className={itemCls}>
							{item.children?.length ? (
								<NavigationDropdown
									flyoutClassName={styles['c-navigation__list-flyout']}
									id={item.id}
									isOpen={openDropdownId === item.id}
									lockScroll={openDropdownId === item.id}
									items={item.children}
									trigger={renderTrigger(
										item,
										openDropdownId === item.id ? IconNamesLight.AngleUp : IconNamesLight.AngleDown
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
