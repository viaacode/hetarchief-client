import clsx from 'clsx';
import { FC } from 'react';

import styles from './Navigation.module.scss';
import {
	NavigationCenterProps,
	NavigationFC,
	NavigationProps,
	NavigationSectionProps,
} from './Navigation.types';
import NavigationList from './NavigationList/NavigationList';

const NavigationSection: FC<NavigationSectionProps> = ({ children, items }) => (
	<div className={styles['c-navigation__section']}>
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
	});

	return <nav className={rootCls}>{children}</nav>;
};

Navigation.Left = NavigationSection;
Navigation.Center = NavigationCenter;
Navigation.Right = NavigationSection;

export default Navigation;
