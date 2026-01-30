import type { MediaActions } from '@ie-objects/ie-objects.types';
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
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { useElementSize } from '@shared/hooks/use-element-size';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { isMobileSize } from '@shared/utils/is-mobile';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import clsx from 'clsx';
import { type FC, type ReactElement, type ReactNode, useRef, useState } from 'react';

import {
	DYNAMIC_ACTION_BOX,
	DYNAMIC_ACTION_SPACER,
	DYNAMIC_ACTION_WIDTH,
} from './DynamicActionMenu.const';
import styles from './DynamicActionMenu.module.scss';
import type { ActionItem, DynamicActionMenuProps } from './DynamicActionMenu.types';

const DynamicActionMenu: FC<DynamicActionMenuProps> = ({
	className,
	actions,
	limit = 0,
	onClickAction,
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const listRef = useRef<HTMLDivElement>(null);
	const size = useElementSize(listRef);

	const windowSize = useWindowSizeContext();
	const isMobile = isMobileSize(windowSize);

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
			<NoServerSideRendering>
				<Tooltip position="top">
					<TooltipTrigger>{trigger}</TooltipTrigger>
					<TooltipContent>{tooltip}</TooltipContent>
				</Tooltip>
			</NoServerSideRendering>
		);
	};

	const renderPrimaryButton = (action: ActionItem) => {
		const $element = action.customElement ? (
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
		);
		if (action.url) {
			return (
				<li
					className={styles['c-dynamic-action-menu__primary-item']}
					key={`media-action-${action.id}`}
				>
					<a href={action.url} target="_blank" referrerPolicy="no-referrer" rel="noreferrer">
						{$element}
					</a>
				</li>
			);
		}
		return (
			<li
				className={styles['c-dynamic-action-menu__primary-item']}
				key={`media-action-${action.id}`}
			>
				{$element}
			</li>
		);
	};

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

		if (action.url) {
			return (
				<li
					className={styles['c-dynamic-action-menu__secondary-item']}
					key={`media-action-${action.id}`}
				>
					<a href={action.url} target="_blank" referrerPolicy="no-referrer" rel="noreferrer">
						{action.tooltip && !isMobile ? renderInTooltip($element, action.tooltip) : $element}
					</a>
				</li>
			);
		}
		return (
			<li
				className={styles['c-dynamic-action-menu__secondary-item']}
				key={`media-action-${action.id}`}
			>
				{action.tooltip && !isMobile ? renderInTooltip($element, action.tooltip) : $element}
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
		<ul className={clsx(className, styles['c-dynamic-action-menu'])}>
			{primaryActions.map(renderPrimaryButton)}
			<div
				className={styles['c-dynamic-action-menu__secondary']}
				ref={listRef}
				style={{
					minWidth: `${(limit + 1) * DYNAMIC_ACTION_WIDTH + limit * DYNAMIC_ACTION_SPACER}px`,
				}}
			>
				{visibleActions.map(renderSecondaryButton)}
				{!!hiddenActions.length && renderDropdown(secondaryActions)}
			</div>
		</ul>
	);
};

export default DynamicActionMenu;
