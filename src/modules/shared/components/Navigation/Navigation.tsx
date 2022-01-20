import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useState } from 'react';

import { Icon, IconLightNames } from '../Icon';
import { Overlay } from '../Overlay';

import styles from './Navigation.module.scss';
import {
	NavigationCenterProps,
	NavigationFC,
	NavigationProps,
	NavigationSectionProps,
} from './Navigation.types';
import { NavigationDropdown } from './NavigationDropdown';
import NavigationList from './NavigationList/NavigationList';

const NavigationSection: FC<NavigationSectionProps> = ({
	children,
	items,
	placement,
	renderHamburger,
	hamburgerProps,
}) => {
	const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false); // Note: Needed for overlay state. Dropdown state is saved in NavigationDropdown component

	const renderHamburgerMenu = () => {
		return (
			<div className={styles['c-navigation__section--responsive-mobile']}>
				{renderHamburger && (
					<Overlay
						visible={isHamburgerMenuOpen}
						className={styles['c-navigation__dropdown-overlay']}
					/>
				)}
				<NavigationDropdown
					id={'menu'}
					isOpen={isHamburgerMenuOpen}
					items={items ? items : []}
					trigger={
						<Button
							label={
								isHamburgerMenuOpen
									? hamburgerProps?.hamburgerLabelOpen
									: hamburgerProps?.hamburgerLabelClosed
							}
							variants="text"
							className="u-color-white u-px-12 u-ml--12"
							iconStart={
								hamburgerProps?.hamburgerIconOpen &&
								hamburgerProps?.hamburgerIconClosed && (
									<Icon
										className={clsx(
											'u-fs-24',
											`u-text-${placement}`,
											!isHamburgerMenuOpen && 'u-color-teal'
										)}
										name={
											isHamburgerMenuOpen
												? (hamburgerProps?.hamburgerIconOpen as IconLightNames)
												: (hamburgerProps?.hamburgerIconClosed as IconLightNames)
										}
									/>
								)
							}
						/>
					}
					lockScroll
					flyoutClassName={styles['c-navigation__dropdown-flyout']}
					onOpen={() => setIsHamburgerMenuOpen(true)}
					onClose={() => setIsHamburgerMenuOpen(false)}
				/>
			</div>
		);
	};

	const renderDesktop = () => {
		return renderHamburger ? (
			<div className={styles['c-navigation__section--responsive-desktop']}>
				{items && items.length ? <NavigationList items={items} /> : children}
			</div>
		) : (
			<>{items && items.length ? <NavigationList items={items} /> : children}</>
		);
	};
	return (
		<div
			className={clsx(
				styles['c-navigation__section'],
				styles[`c-navigation__section--${placement}`]
			)}
		>
			{renderDesktop()}
			{renderHamburger && renderHamburgerMenu()}
		</div>
	);
};

const NavigationCenter: FC<NavigationCenterProps> = ({ children, title }) => (
	<div className={styles['c-navigation__section']}>
		{title ? <h1 className={styles['c-navigation__title']}>{title}</h1> : children}
	</div>
);

const Navigation: NavigationFC<NavigationProps> = ({ children, className, contextual = false }) => {
	const rootCls = clsx(className, styles['c-navigation'], {
		[styles['c-navigation--sm']]: contextual,
		[styles['c-navigation--responsive']]: !contextual,
	});

	return <nav className={rootCls}>{children}</nav>;
};

Navigation.Left = NavigationSection;
Navigation.Center = NavigationCenter;
Navigation.Right = NavigationSection;

export default Navigation;
