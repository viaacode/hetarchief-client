import { Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import { useScrollLock } from '@shared/hooks';
import { isBrowser } from '@shared/utils';

import { NavigationItem } from '..';
import styles from '../Navigation.module.scss';

import { NavigationDropdownProps } from './NavigationDropdown.types';

const NavigationDropdown: FC<NavigationDropdownProps> = ({
	id,
	isOpen,
	items,
	trigger,
	lockScroll,
	flyoutClassName,
	onOpen,
	onClose,
}) => {
	useScrollLock(isBrowser() ? document.body : null, lockScroll ? isOpen : false);

	const renderChildrenRecursively = (items: NavigationItem[], layer = 0): ReactNode => {
		return (
			<div className={clsx(layer > 0 && styles['c-dropdown-menu__sub-list'])}>
				{items.map((item) => {
					return (
						<>
							{item.hasDivider && (
								<div className={styles['c-navigation__divider--horizontal']} />
							)}
							{item.node}
							{item.children &&
								renderChildrenRecursively(item.children, (layer += 1))}
						</>
					);
				})}
			</div>
		);
	};

	return (
		<Dropdown
			className={styles['c-navigation__dropdown']}
			isOpen={isOpen}
			triggerWidth="full-width"
			flyoutClassName={flyoutClassName}
			onOpen={() => onOpen && onOpen(id)}
			onClose={() => onClose && onClose(id)}
		>
			<DropdownButton>{trigger}</DropdownButton>
			<DropdownContent>{renderChildrenRecursively(items)}</DropdownContent>
		</Dropdown>
	);
};

export default NavigationDropdown;
