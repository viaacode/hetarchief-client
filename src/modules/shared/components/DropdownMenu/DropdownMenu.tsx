import {
	Button,
	ButtonProps,
	Dropdown,
	DropdownButton,
	DropdownContent,
	DropdownProps,
	useClickOutside,
} from '@meemoo/react-components';
import { FC, MouseEvent, useState } from 'react';

import { Icon } from '../Icon';

import styles from './DropdownMenu.module.scss';

type DropdownMenuProps = Omit<DropdownProps, 'isOpen'> & {
	triggerButtonProps?: ButtonProps & { onClick?: (evt: MouseEvent) => void };
};

export const DropdownMenu: FC<DropdownMenuProps> = ({ triggerButtonProps, children, ...rest }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [menuContentRef, setMenuContentRef] = useState<HTMLElement | null>(null);

	useClickOutside(menuContentRef as Element, () => setIsOpen(false));

	return (
		<Dropdown
			{...rest}
			isOpen={isOpen}
			flyoutClassName={styles['c-dropdown-menu--menu-content']}
		>
			<DropdownButton>
				<Button
					icon={<Icon name="dots-vertical" />}
					variants="text"
					{...triggerButtonProps}
					onClick={(evt: MouseEvent) => {
						evt.stopPropagation();
						setIsOpen(!isOpen);
						triggerButtonProps?.onClick?.(evt);
					}}
				/>
			</DropdownButton>
			<DropdownContent>
				<div
					className={styles['c-dropdown-menu--menu-content-wrapper']}
					ref={setMenuContentRef}
				>
					{children}
				</div>
			</DropdownContent>
		</Dropdown>
	);
};
