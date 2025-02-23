import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, Fragment, useState } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { LanguageSwitcher } from '@shared/components/LanguageSwitcher/LanguageSwitcher';
import { Overlay } from '@shared/components/Overlay';

import styles from '../Navigation.module.scss';
import { NavigationDropdown } from '../NavigationDropdown';
import { NavigationList } from '../NavigationList';

import type { NavigationSectionProps } from './NavigationSection.types';

export const NavigationSection: FC<NavigationSectionProps> = ({
	children,
	currentPath,
	items,
	placement,
	renderHamburger,
	hamburgerProps,
	onOpenDropdowns,
}) => {
	// Needed for overlay state. Dropdown state is saved in NavigationDropdown component
	const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

	const renderHamburgerMenu = () => {
		return (
			<div className={clsx(styles['c-navigation__section--responsive-mobile'])}>
				<LanguageSwitcher className="c-navigation__hamburger__language-switcher" />
				<Overlay
					visible={isHamburgerMenuOpen}
					className={clsx(
						styles['c-navigation__dropdown-overlay'],
						styles['c-navigation__hamburger-overlay']
					)}
				/>
				<NavigationDropdown
					id="menu"
					isOpen={isHamburgerMenuOpen}
					lockScroll={isHamburgerMenuOpen}
					items={items ? items : []}
					className={clsx(styles['c-navigation__hamburger'], {
						[styles['c-navigation__hamburger--open']]: isHamburgerMenuOpen,
					})}
					flyoutClassName={clsx(styles['c-navigation__dropdown-flyout'])}
					trigger={
						<Button
							label={isHamburgerMenuOpen ? hamburgerProps?.openLabel : hamburgerProps?.closedLabel}
							variants="text"
							className="u-color-white u-px-0 u-py-0 u-ml--12 u-line-height-1-25"
							iconStart={
								<Icon
									className={clsx(
										'u-font-size-24',
										`u-text-${placement}`,
										!isHamburgerMenuOpen && 'u-color-teal'
									)}
									name={
										isHamburgerMenuOpen
											? hamburgerProps?.openIcon || IconNamesLight.Times
											: hamburgerProps?.closedIcon || IconNamesLight.Menu
									}
								/>
							}
						/>
					}
					onOpen={() => {
						setIsHamburgerMenuOpen(true);
						onOpenDropdowns?.();
					}}
					onClose={() => {
						setIsHamburgerMenuOpen(false);
					}}
				/>
			</div>
		);
	};

	const renderDesktop = () => {
		const Wrapper = renderHamburger ? 'div' : Fragment;
		const wrapperCls = clsx(renderHamburger && styles['c-navigation__section--responsive-desktop']);

		return (
			<Wrapper {...(wrapperCls && { className: wrapperCls })}>
				{items?.length ? (
					<NavigationList
						currentPath={currentPath}
						items={items}
						onOpenDropdowns={onOpenDropdowns}
					/>
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
