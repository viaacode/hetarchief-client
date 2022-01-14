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
import { FC } from 'react';

import { Icon, IconLightNames } from '@shared/components';
import { useScrollLock } from '@shared/hooks';
import { isBrowser } from '@shared/utils';

import styles from '../Navigation.module.scss';

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

	const renderMenuItem = (item: MenuItemInfo) => {
		// item.id holds original href
		return (
			<Link href={`/${item.id as string}`}>
				<a
					className="u-color-black c-dropdown-menu__item"
					role="menuitem"
					tabIndex={0}
					key={item.key ? item.key : `menu-item-${item.id}`}
				>
					{item.iconStart && item.iconStart}
					{item.label}
					{item.iconEnd && item.iconEnd}
				</a>
			</Link>
		);
	};

	const handleOnClick = (id: string | number) => {
		router.push(`/${id}`);
	};

	const menuItems: MenuItemInfo[][] = items.map((itemArray) => {
		return itemArray.map((item) => {
			return {
				label: item.label,
				id: item.href,
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
