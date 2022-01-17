import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { FC, ReactNode, useState } from 'react';

import { Icon, IconLightNames, Overlay } from '@shared/components';

import { NavigationItem } from '..';
import styles from '../Navigation.module.scss';
import { NavigationDropdown } from '../NavigationDropdown';

import { NavigationListProps } from './NavigationList.types';

const NavigationList: FC<NavigationListProps> = ({ items }) => {
	const [openDropdown, setOpenDropdown] = useState('');

	const renderLink = (
		item: NavigationItem,
		linkCls: string,
		icon: IconLightNames | undefined = undefined
	): ReactNode => {
		return (
			<Link href={item.href}>
				<a className={linkCls}>
					{item.label}
					<span className={styles['c-navigation__border-decoration']} />
					<span className={styles['c-navigation__border-decoration']} />
					{item.badge && <Badge text={item.badge} />}
					{icon && <Icon className="u-text-left u-ml-4" name={icon} />}
				</a>
			</Link>
		);
	};

	const renderDropdown = (
		id: string,
		trigger: ReactNode,
		dropdownItems: NavigationItem[][]
	): ReactNode => {
		return (
			<>
				<NavigationDropdown
					id={id}
					isOpen={openDropdown === id}
					items={dropdownItems}
					trigger={trigger}
					lockScroll
					onOpen={(id) => setOpenDropdown(id)}
					onClose={() => setOpenDropdown('')}
					flyoutClassName={styles['c-navigation__list-flyout']}
				/>
			</>
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
			{items.map((navItems, itemIndex) => {
				return (
					<ul key={`nav-list-${itemIndex}`} className={styles['c-navigation__list']}>
						{navItems.map((item, i) => {
							const linkCls = clsx(
								styles['c-navigation__link'],
								styles[`c-navigation__link--variant-${i + 1}`],
								{
									[styles['c-navigation__link--active']]: item.isActive,
								}
							);
							return (
								<li key={item.label} className={styles['c-navigation__item']}>
									{item.dropdown?.length
										? renderDropdown(
												item.id,
												renderLink(
													item,
													linkCls,
													openDropdown === item.id
														? 'angle-up'
														: 'angle-down'
												),
												item.dropdown
										  )
										: renderLink(item, linkCls)}
								</li>
							);
						})}
					</ul>
				);
			})}
		</>
	);
};

export default NavigationList;
