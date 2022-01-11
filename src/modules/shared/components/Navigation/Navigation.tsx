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

const NavigationSection: FC<NavigationSectionProps> = ({ children, items, placement }) => (
	<div
		className={clsx(
			styles['c-navigation__section'],
			styles[`c-navigation__section--${placement}`]
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
	});

	return <nav className={rootCls}>{children}</nav>;
};

// eslint-disable-next-line react/display-name
Navigation.Left = (props) => <NavigationSection {...props} placement="left" />;
Navigation.Center = NavigationCenter;
// eslint-disable-next-line react/display-name
Navigation.Right = (props) => <NavigationSection {...props} placement="right" />;

export default Navigation;
