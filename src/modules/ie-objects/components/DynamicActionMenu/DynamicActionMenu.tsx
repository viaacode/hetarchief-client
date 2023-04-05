import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactElement, ReactNode, useRef, useState } from 'react';

import { MediaActions } from '@ie-objects/types';
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

const DynamicActionMenu: FC<DynamicActionMenuProps> = ({
	className,
	actions,
	limit = 0,
	onClickAction,
}) => {
	const { tText } = useTranslation();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const listRef = useRef<HTMLDivElement>(null);
	const size = useElementSize(listRef);

	const primaryActions = actions.filter(({ isPrimary }: ActionItem) => isPrimary);
	const secondaryActions = actions.filter(({ isPrimary }: ActionItem) => !isPrimary);

	const totalWidth =
		DYNAMIC_ACTION_WIDTH * secondaryActions.length +
		DYNAMIC_ACTION_SPACER * (secondaryActions.length - 1);

	// Counts buttons that don't fit the container
	const overflowCount = size?.width
		? Math.ceil(
				(totalWidth - size.width) /
					(size.width < totalWidth ? DYNAMIC_ACTION_BOX : DYNAMIC_ACTION_WIDTH)
		  )
		: 0;

	// Clamp items to hide at limit
	const limitReached = secondaryActions.length - (overflowCount + 1) < limit;
	const itemsToHide = limitReached ? secondaryActions.length - limit : overflowCount + 1;

	// Divide actions into visible and dropdown actions
	const visibleActions =
		itemsToHide > 1 ? secondaryActions.slice(0, -itemsToHide) : secondaryActions;
	const hiddenActions = itemsToHide > 1 ? secondaryActions.slice(-itemsToHide) : [];

	const renderInTooltip = (trigger: ReactNode, tooltip: string): ReactElement => {
		return (
			<Tooltip position="top">
				<TooltipTrigger>{trigger}</TooltipTrigger>
				<TooltipContent>{tooltip}</TooltipContent>
			</Tooltip>
		);
	};

	const renderPrimaryButton = (action: ActionItem) => (
		<li
			className={styles['c-dynamic-action-menu__primary-item']}
			key={`media-action-${action.id}`}
			role="listitem"
		>
			{action.customElement ? (
				action.customElement
			) : (
				<Button
					variants={['teal', 'md']}
					iconStart={action.icon}
					onClick={() => onClickAction(action.id)}
					aria-label={action.ariaLabel}
					title={action.tooltip}
				>
					<span className="u-text-ellipsis">{action.label}</span>
				</Button>
			)}
		</li>
	);

	const renderSecondaryButton = (action: ActionItem) => {
		const $element = action.customElement ? (
			action.customElement
		) : (
			<Button
				onClick={() => onClickAction(action.id)}
				icon={action.icon}
				variants={['silver']}
				aria-label={action.ariaLabel}
				title={action.tooltip}
			/>
		);

		return (
			<li
				className={styles['c-dynamic-action-menu__secondary-item']}
				key={`media-action-${action.id}`}
				role="listitem"
			>
				{action.tooltip ? renderInTooltip($element, action.tooltip) : $element}
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
						icon={<Icon name={IconNamesLight.DotsHorizontal} aria-hidden />}
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
			<ul className={clsx(className, styles['c-dynamic-action-menu'])} role="list">
				{primaryActions.map(renderPrimaryButton)}
				<div
					className={styles['c-dynamic-action-menu__secondary']}
					ref={listRef}
					style={{
						minWidth: `${
							(limit + 1) * DYNAMIC_ACTION_WIDTH + limit * DYNAMIC_ACTION_SPACER
						}px`,
					}}
				>
					{visibleActions.map(renderSecondaryButton)}
					{!!hiddenActions.length && renderDropdown(hiddenActions)}
				</div>
			</ul>
		</>
	);
};

export default DynamicActionMenu;
