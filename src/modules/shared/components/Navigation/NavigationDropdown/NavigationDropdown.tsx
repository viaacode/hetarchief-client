import {
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
	MenuItemInfo,
} from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import router from 'next/router';
import { FC, ReactNode } from 'react';

import { Icon, IconLightNames } from '@shared/components';
import { useScrollLock } from '@shared/hooks';
import { isBrowser } from '@shared/utils';

import styles from '../Navigation.module.scss';
import { NavigationItem } from '../Navigation.types';

import { NavigationDropdownProps } from './NavigationDropdown.types';

const NavigationDropdown: FC<NavigationDropdownProps> = ({
	id,
	isOpen,
	items,
	trigger,
	lockScroll,
	flyoutClassName,
	onOpen,
	onClose,
}) => {
	useScrollLock(isBrowser() ? document.body : null, lockScroll ? isOpen : false);

	// Render menu items
	const renderMenuItem = (menuItem: MenuItemInfo) => {
		const currentItem = items.flat().find((item) => menuItem.id === item.id);

		return (
			<>
				<Link href={`/${currentItem?.href}`}>
					<a
						className="u-color-black c-dropdown-menu__item"
						role="menuitem"
						tabIndex={0}
						key={`menu-item-${menuItem.id}`}
					>
						{menuItem.iconStart && menuItem.iconStart}
						{menuItem.label}
						{menuItem.iconEnd && menuItem.iconEnd}
					</a>
				</Link>
				{currentItem &&
					(currentItem as NavigationItem).dropdown?.length &&
					renderSubMenuItems(currentItem)}
			</>
		);
	};

	const renderSubMenuItems = (currentItem: NavigationItem): ReactNode | null => {
		return (
			<div className={styles['c-dropdown-menu__sub-list']}>
				{(currentItem as NavigationItem).dropdown?.flat().map((item) => {
					if (item.hideOnMobile) {
						return;
					}
					return (
						<Link key={`sub-menu-item-${item.id}`} href={`/${item?.href}`}>
							<a
								className="u-color-black c-dropdown-menu__item"
								role="menuitem"
								tabIndex={0}
							>
								{item.label}
							</a>
						</Link>
					);
				})}
			</div>
		);
	};

	const handleOnClick = (id: string | number) => {
		router.push(`/${id}`);
	};

	const menuItems: MenuItemInfo[][] = items.map((itemArray) => {
		return itemArray.map((item) => {
			return {
				label: item.label,
				id: item.id,
				key: `${item.label} - ${item.href}`,
				iconStart: (
					<Icon
						className={clsx('u-fs-24', styles['c-navigation__dropdown-icon--start'])}
						name={item.iconStart as IconLightNames}
					/>
				),
				iconEnd: (
					<Icon
						className={clsx('u-fs-24', styles['c-navigation__dropdown-icon--end'])}
						name={item.iconEnd as IconLightNames}
					/>
				),
			};
		});
	});

	return (
		<Dropdown
			className={styles['c-navigation__dropdown']}
			isOpen={isOpen}
			triggerWidth="full-width"
			flyoutClassName={flyoutClassName}
			onOpen={() => onOpen && onOpen(id)}
			onClose={() => onClose && onClose(id)}
		>
			<DropdownButton>{trigger}</DropdownButton>
			<DropdownContent>
				<MenuContent
					rootClassName="c-dropdown-menu"
					className={'u-color-black'}
					menuItems={menuItems}
					renderItem={renderMenuItem}
					onClick={(id: string | number) => handleOnClick(id)}
				/>
			</DropdownContent>
		</Dropdown>
	);
};

export default NavigationDropdown;
