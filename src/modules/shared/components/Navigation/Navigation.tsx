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

import { useScrollLock } from '@shared/hooks';
import { isBrowser } from '@shared/utils';

import { Icon } from '../Icon';
import { Overlay } from '../Overlay';

import styles from './Navigation.module.scss';
import {
	NavigationCenterProps,
	NavigationFC,
	NavigationProps,
	NavigationSectionProps,
} from './Navigation.types';
import NavigationList from './NavigationList/NavigationList';

const NavigationLeft: FC<NavigationSectionProps> = ({ children, items }) => {
	const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

	useScrollLock(isBrowser() ? document.body : null, isHamburgerMenuOpen);

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

	// Map items to fit {label: string, id: string}; id will hold href
	const renderHamburgerMenu = () => {
		const menuItems: MenuItemInfo[][] = items
			? items.map((itemArray) => {
					return itemArray.map((item) => {
						return {
							label: item.label,
							id: item.href,
							key: item.label,
						};
					});
			  })
			: [];

		const handleOnClick = (id: string | number) => {
			router.push(`/${id}`);
		};

		return (
			<div className={styles['c-navigation__section--responsive-mobile']}>
				<Overlay
					visible={isHamburgerMenuOpen}
					className={styles['c-navigation__dropdown-overlay']}
				/>
				<Dropdown
					className={styles['c-navigation__dropdown']}
					isOpen={isHamburgerMenuOpen}
					triggerWidth="full-width"
					flyoutClassName={styles['c-navigation__dropdown-flyout']}
					onOpen={() => setIsHamburgerMenuOpen(true)}
					onClose={() => setIsHamburgerMenuOpen(false)}
				>
					<DropdownButton>
						<Button
							label={isHamburgerMenuOpen ? 'Sluit' : 'Menu'}
							variants="text"
							className="u-color-white u-px-12 u-ml--12"
							iconStart={
								<Icon
									className={clsx(
										'u-fs-24',
										!isHamburgerMenuOpen && 'u-color-teal'
									)}
									name={isHamburgerMenuOpen ? 'times' : 'grid-view'}
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
			</div>
		);
	};

	const renderDesktop = () => {
		return (
			<div className={styles['c-navigation__section--responsive-desktop']}>
				{items && items.length ? <NavigationList items={items} /> : children}
			</div>
		);
	};
	return (
		<div
			className={clsx(styles['c-navigation__section'], styles['c-navigation__section--left'])}
		>
			{renderDesktop()}
			{renderHamburgerMenu()}
		</div>
	);
};

const NavigationRight: FC<NavigationSectionProps> = ({ children, items }) => (
	<div
		className={clsx(
			styles['c-navigation__section'],
			styles['c-navigation__section--right'],
			'u-text-right'
		)}
	>
		{items && items.length ? <NavigationList items={items} /> : children}
	</div>
);

const NavigationCenter: FC<NavigationCenterProps> = ({ children, title }) => (
	<div className={styles['c-navigation__section']}>
		{title ? <h1 className={styles['c-navigation__title']}>{title}</h1> : children}
	</div>
);

const Navigation: NavigationFC<NavigationProps> = ({ children, contextual = false }) => {
	const rootCls = clsx(styles['c-navigation'], {
		[styles['c-navigation--sm']]: contextual,
		[styles['c-navigation--responsive']]: !contextual,
	});

	return <nav className={rootCls}>{children}</nav>;
};

Navigation.Left = NavigationLeft;
Navigation.Center = NavigationCenter;
Navigation.Right = NavigationRight;

export default Navigation;
