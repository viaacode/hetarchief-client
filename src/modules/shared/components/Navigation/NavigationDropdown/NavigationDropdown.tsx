import { Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, Fragment, ReactNode } from 'react';

import { useScrollLock } from '@shared/hooks';

import styles from '../Navigation.module.scss';
import { NavigationItem } from '../Navigation.types';

import { NavigationDropdownProps } from './NavigationDropdown.types';

const NavigationDropdown: FC<NavigationDropdownProps> = ({
	id,
	isOpen,
	items,
	trigger,
	lockScroll,
	className,
	flyoutClassName,
	onOpen,
	onClose,
}) => {
	useScrollLock(lockScroll ? isOpen : false);

	const renderChildrenRecursively = (items: NavigationItem[], layer = 0): ReactNode => {
		return (
			<div className={clsx(layer > 0 && styles['c-dropdown-menu__sub-list'])}>
				{items.map((item) => {
					return (
						<Fragment key={`nav-dropdown-item-${item.id}`}>
							{item.hasDivider && (
								<div className={styles['c-navigation__divider--horizontal']} />
							)}
							{item.node}
							{item.children &&
								renderChildrenRecursively(item.children, (layer += 1))}
						</Fragment>
					);
				})}
			</div>
		);
	};

	return (
		<Dropdown
			className={clsx(styles['c-navigation__dropdown'], className)}
			isOpen={isOpen}
			triggerWidth="full-width"
			flyoutClassName={flyoutClassName}
			onOpen={() => onOpen?.(id)}
			onClose={() => onClose?.(id)}
		>
			<DropdownButton>{trigger}</DropdownButton>
			<DropdownContent>{renderChildrenRecursively(items)}</DropdownContent>
		</Dropdown>
	);
};

export default NavigationDropdown;
