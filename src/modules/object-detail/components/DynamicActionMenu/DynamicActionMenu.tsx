import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useRef, useState } from 'react';

import { Icon, IconLightNames } from '@shared/components';
import { useElementSize } from '@shared/hooks';

import styles from './DynamicActionMenu.module.scss';
import { ActionItem, DynamicActionMenuProps } from './DynamicActionMenu.types';

const DynamicActionMenu: FC<DynamicActionMenuProps> = ({
	className,
	actions,
	limit = 0,
	onClickAction,
}) => {
	const listRef = useRef<HTMLUListElement>(null);
	const size = useElementSize(listRef);

	const totalWidth = 48 * actions.length + 8 * (actions.length - 1);

	// Counts buttons that don't fit the container
	const overflowCount = size?.width
		? Math.ceil((totalWidth - size.width) / (size.width < totalWidth ? 56 : 48))
		: 0;

	// Clamp items to hide at limit
	const limitReached = actions.length - (overflowCount + 1) < limit;
	const itemsToHide = limitReached ? actions.length - limit : overflowCount + 1;

	// Divide actions into visible and dropdown actions
	const visibleActions = itemsToHide > 1 ? actions.slice(0, -itemsToHide) : actions;
	const hiddenActions = itemsToHide > 1 ? actions.slice(-itemsToHide) : [];

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const renderIcon = (name: IconLightNames) => <Icon name={name} />;

	const renderButton = (action: ActionItem) => {
		return (
			<li key={`media-action-${action.id}`} role="listitem">
				<Button
					onClick={() => onClickAction(action.id)}
					icon={renderIcon(action.iconName)}
					variants={['silver']}
				/>
			</li>
		);
	};

	const renderDropdown = (dropdownActions: ActionItem[]) => {
		const mappedActions = dropdownActions.map((action) => {
			return {
				...action,
				iconStart: renderIcon(action.iconName),
			};
		});
		return (
			<Dropdown
				isOpen={isDropdownOpen}
				onOpen={() => setIsDropdownOpen(true)}
				onClose={() => setIsDropdownOpen(false)}
			>
				<DropdownButton>
					<Button icon={renderIcon('dots-horizontal')} variants={['silver']} />
				</DropdownButton>
				<DropdownContent>
					<MenuContent
						rootClassName="c-dropdown-menu"
						menuItems={mappedActions}
						onClick={(id) => onClickAction(id as string)}
					/>
				</DropdownContent>
			</Dropdown>
		);
	};

	return (
		<>
			<ul
				ref={listRef}
				className={clsx(className, styles['c-dynamic-action-menu'])}
				role="list"
			>
				{visibleActions.map(renderButton)}
				{!!hiddenActions.length && renderDropdown(hiddenActions)}
			</ul>
		</>
	);
};

export default DynamicActionMenu;
