import { Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, type ReactNode } from 'react';

import { type NavigationItem } from '@navigation/components/Navigation/NavigationSection/NavigationSection.types';
import { useScrollLock } from '@shared/hooks/use-scroll-lock';

import styles from '../Navigation.module.scss';

import { type NavigationDropdownProps } from './NavigationDropdown.types';

const NavigationDropdown: FC<NavigationDropdownProps> = ({
	id,
	isOpen,
	items,
	renderedItems,
	trigger,
	lockScroll = false,
	className,
	flyoutClassName,
	onOpen,
	onClose,
}) => {
	useScrollLock(lockScroll ? isOpen : false, 'NavigationDropdown');

	const renderChildrenRecursively = (items: NavigationItem[], layer = 0): ReactNode => {
		return (
			<div
				className={clsx(layer > 0 && styles['c-navigation__dropdown-submenu'])}
				onClick={() => onClose?.()} // Close dropdown on item click
			>
				{items.map((item) => {
					return (
						<div
							key={`nav-dropdown-item-${item.id}`}
							className={clsx({
								[styles['c-navigation__dropdown-item--divider']]: item.isDivider,
								[styles['c-navigation__dropdown-item--divider:md']]:
									item.isDivider === 'md',
								[styles['c-navigation__item--active']]: item.activeMobile,
							})}
						>
							{typeof item.node === 'function'
								? item.node({ closeDropdowns: () => onClose?.() })
								: item.node}
							{item.children && renderChildrenRecursively(item.children, layer + 1)}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<Dropdown
			className={clsx(className, styles['c-navigation__dropdown'], {
				[styles['c-navigation__dropdown--open']]: isOpen,
			})}
			isOpen={isOpen}
			triggerWidth="full-width"
			flyoutClassName={flyoutClassName}
			onOpen={() => onOpen?.(id)}
			onClose={() => onClose?.(id)}
		>
			<DropdownButton>{trigger}</DropdownButton>
			<DropdownContent>{renderedItems ?? renderChildrenRecursively(items!)}</DropdownContent>
		</Dropdown>
	);
};

export default NavigationDropdown;
