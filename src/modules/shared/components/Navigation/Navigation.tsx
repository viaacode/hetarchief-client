import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

import styles from './Navigation.module.scss';
import {
	NavigationCenterProps,
	NavigationFC,
	NavigationItem,
	NavigationProps,
	NavigationSectionProps,
} from './Navigation.types';

const renderItems = (items: NavigationItem[][]) => {
	return items.map((navItems, itemIndex) => {
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
									<span className={styles['c-navigation__border-decoration']} />
									<span className={styles['c-navigation__border-decoration']} />
								</a>
							</Link>
						</li>
					);
				})}
			</ul>
		);
	});
};

const NavigationLeft: FC<NavigationSectionProps> = ({ children, items }) => (
	<div className={styles['c-navigation__section']}>
		{items && items.length ? renderItems(items) : children}
	</div>
);
const NavigationCenter: FC<NavigationCenterProps> = ({ children, title }) => (
	<>{title ? <h1 className={styles['c-navigation__title']}>{title}</h1> : children}</>
);
const NavigationRight: FC<NavigationSectionProps> = ({ children, items }) => (
	<>{items && items.length ? renderItems(items) : children}</>
);

const Navigation: NavigationFC<NavigationProps> = ({ children, contextual = false }) => {
	const rootCls = clsx(styles['c-navigation'], {
		[styles['c-navigation--sm']]: contextual,
	});

	return <nav className={rootCls}>{children}</nav>;
};

Navigation.Left = NavigationLeft;
Navigation.Center = NavigationCenter;
Navigation.Right = NavigationRight;

export default Navigation;
