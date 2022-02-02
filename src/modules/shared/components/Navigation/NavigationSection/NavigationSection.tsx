import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, Fragment, useState } from 'react';

import { Icon, IconProps, Overlay } from '@shared/components';

import styles from '../Navigation.module.scss';
import { NavigationDropdown } from '../NavigationDropdown';
import { NavigationList } from '../NavigationList';

import { NavigationSectionProps } from './NavigationSection.types';

const NavigationSection: FC<NavigationSectionProps> = ({
	children,
	currentPath,
	items,
	placement,
	renderHamburger,
	hamburgerProps,
}) => {
	// Needed for overlay state. Dropdown state is saved in NavigationDropdown component
	const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

	const renderHamburgerMenu = () => {
		return (
			<div className={styles['c-navigation__section--responsive-mobile']}>
				{renderHamburger && (
					<Overlay
						visible={isHamburgerMenuOpen}
						className={clsx(
							styles['c-navigation__dropdown-overlay'],
							styles['c-navigation__hamburger-overlay']
						)}
					/>
				)}
				<NavigationDropdown
					id="menu"
					isOpen={isHamburgerMenuOpen}
					items={items ? items : []}
					className={styles['c-navigation__hamburger']}
					trigger={
						<Button
							label={
								isHamburgerMenuOpen
									? hamburgerProps?.openLabel
									: hamburgerProps?.closedLabel
							}
							variants="text"
							className="u-color-white u-px-12 u-ml--12"
							iconStart={
								<Icon
									className={clsx(
										'u-font-size-24',
										`u-text-${placement}`,
										!isHamburgerMenuOpen && 'u-color-teal'
									)}
									name={
										isHamburgerMenuOpen
											? hamburgerProps?.openIcon
												? hamburgerProps?.openIcon
												: ('times' as IconProps['name'])
											: hamburgerProps?.closedIcon
											? hamburgerProps?.closedIcon
											: ('menu' as IconProps['name'])
									}
								/>
							}
						/>
					}
					lockScroll
					flyoutClassName={clsx(
						styles['c-navigation__dropdown-flyout'],
						styles['c-navigation__hamburger']
					)}
					onOpen={() => setIsHamburgerMenuOpen(true)}
					onClose={() => setIsHamburgerMenuOpen(false)}
				/>
			</div>
		);
	};

	const renderDesktop = () => {
		const Wrapper = renderHamburger ? 'div' : Fragment;
		const wrapperCls = clsx(
			renderHamburger && styles['c-navigation__section--responsive-desktop']
		);

		return (
			<Wrapper {...(wrapperCls && { className: wrapperCls })}>
				{items && items.length ? (
					<NavigationList currentPath={currentPath} items={items} />
				) : (
					children
				)}
			</Wrapper>
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

export default NavigationSection;
