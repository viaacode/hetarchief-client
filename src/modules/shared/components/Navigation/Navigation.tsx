import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '../Icon';

import styles from './Navigation.module.scss';
import {
	NavigationCenterProps,
	NavigationFC,
	NavigationProps,
	NavigationSectionProps,
} from './Navigation.types';
import NavigationList from './NavigationList/NavigationList';

const NavigationLeft: FC<NavigationSectionProps> = ({ children, items }) => {
	const renderMobile = () => {
		return (
			<div className={styles['c-navigation__section--responsive-mobile']}>
				<Button
					label="Menu"
					variants="text"
					className="u-color-white u-px-12 u-ml--12"
					iconStart={<Icon name="grid-view" />}
				/>
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
			{renderMobile()}
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
		[styles['c-navigation--responsive-dropdown']]: !contextual,
	});

	return <nav className={rootCls}>{children}</nav>;
};

Navigation.Left = NavigationLeft;
Navigation.Center = NavigationCenter;
Navigation.Right = NavigationRight;

export default Navigation;
