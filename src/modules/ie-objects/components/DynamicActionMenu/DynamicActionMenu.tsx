import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useRef, useState } from 'react';

import { Icon, IconNamesLight } from '@shared/components';
import { useElementSize } from '@shared/hooks/use-element-size';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import {
	DYNAMIC_ACTION_BOX,
	DYNAMIC_ACTION_SPACER,
	DYNAMIC_ACTION_WIDTH,
} from './DynamicActionMenu.const';
import styles from './DynamicActionMenu.module.scss';
import { ActionItem, DynamicActionMenuProps } from './DynamicActionMenu.types';

import { MediaActions } from 'modules/ie-objects/types';

const DynamicActionMenu: FC<DynamicActionMenuProps> = ({
	className,
	actions,
	limit = 0,
	onClickAction,
}) => {
	const { tText } = useTranslation();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const listRef = useRef<HTMLUListElement>(null);
	const size = useElementSize(listRef);

	const totalWidth =
		DYNAMIC_ACTION_WIDTH * actions.length + DYNAMIC_ACTION_SPACER * (actions.length - 1);

	// Counts buttons that don't fit the container
	const overflowCount = size?.width
		? Math.ceil(
				(totalWidth - size.width) /
					(size.width < totalWidth ? DYNAMIC_ACTION_BOX : DYNAMIC_ACTION_WIDTH)
		  )
		: 0;

	// Clamp items to hide at limit
	const limitReached = actions.length - (overflowCount + 1) < limit;
	const itemsToHide = limitReached ? actions.length - limit : overflowCount + 1;

	// Divide actions into visible and dropdown actions
	const visibleActions = itemsToHide > 1 ? actions.slice(0, -itemsToHide) : actions;
	const hiddenActions = itemsToHide > 1 ? actions.slice(-itemsToHide) : [];

	const renderButton = (action: ActionItem) => {
		return (
			<li
				className={styles['c-dynamic-action-menu__item']}
				key={`media-action-${action.id}`}
				role="listitem"
			>
				<Button
					onClick={() => onClickAction(action.id)}
					icon={action.icon}
					variants={['silver']}
					aria-label={action.ariaLabel}
					title={action.tooltip}
				/>
			</li>
		);
	};

	const renderDropdown = (dropdownActions: ActionItem[]) => {
		const mappedActions = dropdownActions.map((action) => {
			return {
				...action,
				iconStart: action.icon,
			};
		});
		return (
			<Dropdown
				isOpen={isDropdownOpen}
				onOpen={() => setIsDropdownOpen(true)}
				onClose={() => setIsDropdownOpen(false)}
				flyoutClassName={styles['c-dynamic-action-menu__flyout']}
			>
				<DropdownButton>
					<Button
						className={styles['c-dynamic-action-menu__dropdown-button']}
						icon={<Icon name={IconNamesLight.DotsVertical} aria-hidden />}
						aria-label={tText(
							'modules/ie-objects/components/dynamic-action-menu/dynamic-action-menu___meer-acties'
						)}
						variants={['silver']}
					/>
				</DropdownButton>
				<DropdownContent>
					<MenuContent
						rootClassName="c-dropdown-menu"
						menuItems={mappedActions}
						onClick={(id) => onClickAction(id as MediaActions)}
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
				style={{
					minWidth: `${
						(limit + 1) * DYNAMIC_ACTION_WIDTH + limit * DYNAMIC_ACTION_SPACER
					}px`,
				}}
			>
				{visibleActions.map(renderButton)}
				{!!hiddenActions.length && renderDropdown(hiddenActions)}
			</ul>
		</>
	);
};

export default DynamicActionMenu;
