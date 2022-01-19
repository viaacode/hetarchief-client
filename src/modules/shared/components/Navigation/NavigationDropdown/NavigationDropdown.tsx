import { Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import { FC } from 'react';

import { useScrollLock } from '@shared/hooks';
import { isBrowser } from '@shared/utils';

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
			<DropdownContent>
				{items.map((item) => {
					return item.node;
				})}
			</DropdownContent>
		</Dropdown>
	);
};

export default NavigationDropdown;
