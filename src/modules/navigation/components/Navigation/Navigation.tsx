import clsx from 'clsx';
import { type FC } from 'react';

import { NavigationSection } from '@navigation/components/Navigation/NavigationSection/NavigationSection';

import styles from './Navigation.module.scss';
import {
	type NavigationCenterProps,
	type NavigationFC,
	type NavigationProps,
} from './Navigation.types';

const NavigationCenter: FC<NavigationCenterProps> = ({ children, title }) => (
	<div className={styles['c-navigation__section']}>
		{title ? <h1 className={styles['c-navigation__title']}>{title}</h1> : children}
	</div>
);

const NavigationInternal: NavigationFC<NavigationProps> = ({
	children,
	className,
	contextual = false,
	loggedOutGrid = false,
}) => {
	const rootCls = clsx(className, styles['c-navigation'], {
		[styles['c-navigation--sm']]: contextual,
		[styles['c-navigation--responsive']]: !contextual,
		[styles['c-navigation--responsive-logged-out']]: !contextual && loggedOutGrid,
	});

	return <nav className={rootCls}>{children}</nav>;
};

NavigationInternal.Left = NavigationSection;
NavigationInternal.Center = NavigationCenter;
NavigationInternal.Right = NavigationSection;

export const Navigation = NavigationInternal;
