import clsx from 'clsx';
import { FC, ReactNode, useState } from 'react';

import { Icon, IconLightNames, Overlay } from '@shared/components';

import styles from '../Navigation.module.scss';
import { NavigationItem } from '../Navigation.types';
import { NavigationDropdown } from '../NavigationDropdown';

import { NavigationListProps } from './NavigationList.types';

const NavigationList: FC<NavigationListProps> = ({ items }) => {
	const [openDropdown, setOpenDropdown] = useState<string | undefined>(undefined);

	const renderDropdown = (
		id: string,
		trigger: ReactNode,
		dropdownItems: NavigationItem[]
	): ReactNode => {
		return (
			<NavigationDropdown
				id={id}
				isOpen={openDropdown === id}
				items={dropdownItems}
				trigger={trigger}
				lockScroll
				onOpen={(id) => setOpenDropdown(id)}
				onClose={() => setOpenDropdown(undefined)}
				flyoutClassName={styles['c-navigation__list-flyout']}
			/>
		);
	};

	const renderTrigger = (item: NavigationItem, iconName: IconLightNames) => {
		return (
			<div className={styles['c-navigation__link--wrapper']}>
				{item.node}
				<Icon className="u-text-left u-ml-4" name={iconName} />
			</div>
		);
	};

	return (
		<>
			<Overlay
				visible={!!openDropdown}
				className={clsx(
					styles['c-navigation__dropdown-overlay'],
					styles['c-navigation__list-overlay']
				)}
			/>
			<ul className={styles['c-navigation__list']}>
				{items.map((item, index) => {
					return (
						<>
							{item.hasDivider && (
								<div className={styles['c-navigation__divider--vertical']} />
							)}
							<li
								key={`navigation-item-${index}`}
								className={clsx(
									styles['c-navigation__item'],
									styles[`c-navigation__link--variant-${index + 1}`],
									item.active && [styles['c-navigation__item--active']]
								)}
							>
								{item.children?.length
									? renderDropdown(
											item.id,
											renderTrigger(
												item,
												openDropdown === item.id ? 'angle-up' : 'angle-down'
											),
											item.children
									  )
									: item.node}
								{item.active && (
									<>
										<span
											className={styles['c-navigation__border-decoration']}
										/>
										<span
											className={styles['c-navigation__border-decoration']}
										/>
									</>
								)}
							</li>
						</>
					);
				})}
			</ul>
		</>
	);
};

export default NavigationList;
