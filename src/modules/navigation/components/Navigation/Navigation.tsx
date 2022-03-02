import clsx from 'clsx';
import { FC } from 'react';

import styles from './Navigation.module.scss';
import { NavigationCenterProps, NavigationFC, NavigationProps } from './Navigation.types';
import { NavigationSection } from './NavigationSection';

const NavigationCenter: FC<NavigationCenterProps> = ({ children, title }) => (
	<div className={styles['c-navigation__section']}>
		{title ? <h1 className={styles['c-navigation__title']}>{title}</h1> : children}
	</div>
);

const Navigation: NavigationFC<NavigationProps> = ({
	children,
	className,
	contextual = false,
	showBorder,
}) => {
	const rootCls = clsx(className, styles['c-navigation'], {
		[styles['c-navigation--sm']]: contextual,
		[styles['c-navigation--responsive']]: !contextual,
		[styles['c-navigation--bordered']]: showBorder,
	});

	return <nav className={rootCls}>{children}</nav>;
};

Navigation.Left = NavigationSection;
Navigation.Center = NavigationCenter;
Navigation.Right = NavigationSection;

export default Navigation;
