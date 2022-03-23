import {
	Button,
	ButtonProps,
	Dropdown,
	DropdownButton,
	DropdownContent,
	DropdownProps,
	MenuItemInfo,
	useClickOutside,
} from '@meemoo/react-components';
import { FC, useState } from 'react';

import { Icon } from '../Icon';

import styles from './DropdownMenu.module.scss';

type DropdownMenuProps = Omit<DropdownProps, 'isOpen' | 'children'> & {
	triggerButtonProps?: ButtonProps;
	menuItems: MenuItemInfo[];
	onMenuItemClicked: (id: string | number) => void;
};

export const DropdownMenu: FC<DropdownMenuProps> = ({
	triggerButtonProps,
	menuItems,
	onMenuItemClicked,
	...rest
}) => {
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
					onClick={() => {
						setIsOpen(!isOpen);
					}}
					{...triggerButtonProps}
				/>
			</DropdownButton>
			<DropdownContent>
				<div
					className={styles['c-dropdown-menu--menu-content-wrapper']}
					ref={setMenuContentRef}
				>
					{menuItems.map((item: MenuItemInfo) => (
						<Button
							className={styles['c-dropdown-menu--menu-button']}
							key={`menu-option-${item.id}`}
							variants="text"
							label={item.label}
							onClick={() => onMenuItemClicked(item.id)}
						/>
					))}
				</div>
			</DropdownContent>
		</Dropdown>
	);
};
