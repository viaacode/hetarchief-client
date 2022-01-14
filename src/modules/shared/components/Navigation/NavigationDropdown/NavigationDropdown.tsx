import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
	MenuItemInfo,
} from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import router from 'next/router';
import { FC, useState } from 'react';

import { Icon } from '@shared/components';

import styles from '../Navigation.module.scss';

import { NavigationDropdownProps } from './NavigationDropdown.types';

const NavigationDropdown: FC<NavigationDropdownProps> = ({ items, onOpen, onClose }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
					{item.label}
					<span className={styles['c-navigation__border-decoration']} />
					<span className={styles['c-navigation__border-decoration']} />
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
				key: item.label,
			};
		});
	});

	return (
		<Dropdown
			className={styles['c-navigation__dropdown']}
			isOpen={isDropdownOpen}
			triggerWidth="full-width"
			flyoutClassName={styles['c-navigation__dropdown-flyout']}
			onOpen={() => {
				setIsDropdownOpen(true);
				onOpen();
			}}
			onClose={() => {
				setIsDropdownOpen(false);
				onClose();
			}}
		>
			<DropdownButton>
				<Button
					label={isDropdownOpen ? 'Sluit' : 'Menu'}
					variants="text"
					className="u-color-white u-px-12 u-ml--12"
					iconStart={
						<Icon
							className={clsx('u-fs-24', !isDropdownOpen && 'u-color-teal')}
							name={isDropdownOpen ? 'times' : 'grid-view'}
						/>
					}
				/>
			</DropdownButton>
			<DropdownContent>
				<MenuContent
					rootClassName="c-dropdown-menu"
					className={'u-color-black'}
					menuItems={menuItems}
					renderItem={renderMenuItem}
					onClick={(id) => handleOnClick(id)}
				/>
			</DropdownContent>
		</Dropdown>
	);
};

export default NavigationDropdown;
