import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

import styles from '../Navigation.module.scss';

import { NavigationListProps } from './NavigationList.types';

const NavigationList: FC<NavigationListProps> = ({ items }) => {
	return (
		<>
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
									<Link href={item.href}>
										<a className={linkCls}>
											{item.label}
											<span
												className={
													styles['c-navigation__border-decoration']
												}
											/>
											<span
												className={
													styles['c-navigation__border-decoration']
												}
											/>
										</a>
									</Link>
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
