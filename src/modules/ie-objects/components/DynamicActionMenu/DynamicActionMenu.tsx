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
import useIsomorphicLayoutEffect from '@shared/hooks/use-isomorphic-layout-effect';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { isMobileSize } from '@shared/utils/is-mobile';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import clsx from 'clsx';
import { type FC, type ReactElement, type ReactNode, useRef, useState } from 'react';
import { FOCUSABLE_SELECTOR, SECONDARY_ITEM_ATTRIBUTE } from './DynamicActionMenu.const';
import styles from './DynamicActionMenu.module.scss';
import type { ActionItem, DynamicActionMenuProps, FocusHandoff } from './DynamicActionMenu.types';
import {
	getFocusHandoff,
	getItemGap,
	getItemWidth,
	getSecondaryItems,
	getSizeSignature,
	getVisibleCount,
	getWidth,
} from './DynamicActionMenu.utils';

const DynamicActionMenu: FC<DynamicActionMenuProps> = ({
	className,
	actions,
	onClickAction,
	id,
	primaryButtonVariants = ['teal', 'md'],
	secondaryButtonVariants = ['silver'],
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const listRef = useRef<HTMLUListElement>(null);
	const secondaryRef = useRef<HTMLLIElement>(null);
	const dropdownButtonRef = useRef<HTMLButtonElement>(null);
	const sizeSignatureRef = useRef('');
	const focusHandoffRef = useRef<FocusHandoff | null>(null);
	const hiddenIdsRef = useRef<Set<MediaActions>>(new Set());
	const dropdownId = `dynamic-action-menu--${id}`;

	const windowSize = useWindowSizeContext();
	const isMobile = isMobileSize(windowSize);

	const primaryActions = actions.filter(({ isPrimary }: ActionItem) => isPrimary);
	const secondaryActions = actions.filter(({ isPrimary }: ActionItem) => !isPrimary);

	// As many secondary actions as fit stay visible; the rest move into the dropdown. What fits is
	// measured on the full layout: every change that can affect it first renders that layout
	// (isMeasuring, unshrinkable primary) and reads the result before paint, so there is no flicker.
	// The secondary buttons stay mounted (hidden) when they don't fit, so their width stays
	// measurable. The dropdown stays mounted while measuring, or an open flyout would be rebuilt.
	// Starts false: the server-rendered markup is shown before this can measure, and the unshrinkable
	// primary would overflow its container there. The mount effect below switches it on before paint.
	const [isMeasuring, setIsMeasuring] = useState(false);
	const [visibleCount, setVisibleCount] = useState(secondaryActions.length);

	const hiddenActions = secondaryActions.slice(visibleCount);

	// `actions` gets a new identity on unrelated state (e.g. an open export dropdown); only these
	// fields change what is measured
	const actionsKey = actions
		.map(({ id, isPrimary, label }) => `${id}:${isPrimary ? 'primary' : 'secondary'}:${label}`)
		.join('|');

	useIsomorphicLayoutEffect(() => {
		setIsMeasuring(true);
	}, [actionsKey, isMobile]);

	// Not a size hook on the list item: its width changes with the outcome of every measurement,
	// which would trigger the next one. The signature only holds sizes that are independent of it.
	useIsomorphicLayoutEffect(() => {
		const list = listRef.current;
		const secondary = secondaryRef.current;
		if (!list || !secondary || typeof ResizeObserver === 'undefined') {
			return;
		}

		sizeSignatureRef.current = getSizeSignature(list, secondary);
		const observer = new ResizeObserver(() => {
			const signature = getSizeSignature(list, secondary);
			if (signature !== sizeSignatureRef.current) {
				sizeSignatureRef.current = signature;
				setIsMeasuring(true);
			}
		});
		observer.observe(list);
		getSecondaryItems(secondary).forEach((item) => {
			observer.observe(item);
		});

		return () => observer.disconnect();
	}, [actionsKey]);

	useIsomorphicLayoutEffect(() => {
		const list = listRef.current;
		const secondary = secondaryRef.current;
		if (!isMeasuring || !list || !secondary) {
			return;
		}

		const items = getSecondaryItems(secondary);
		const available =
			getWidth(list) -
			Array.from(list.children).reduce(
				(width, child) => (child === secondary ? width : width + getWidth(child)),
				0
			);
		const count = getVisibleCount(items.map(getItemWidth), getItemGap(items), available);

		// Read while the DOM still has the layout the user is focused in
		focusHandoffRef.current = getFocusHandoff(
			secondary,
			dropdownButtonRef.current,
			visibleCount,
			count
		);
		setVisibleCount(count);
		setIsMeasuring(false);
	}, [isMeasuring, visibleCount]);

	// After the commit, so the dropdown button the focus moves to is mounted
	useIsomorphicLayoutEffect(() => {
		const handoff = focusHandoffRef.current;
		const secondary = secondaryRef.current;
		if (isMeasuring || handoff === null || !secondary) {
			return;
		}

		focusHandoffRef.current = null;
		const target =
			handoff === 'dropdown'
				? dropdownButtonRef.current
				: getSecondaryItems(secondary)[handoff]?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
		target?.focus();
	}, [isMeasuring]);

	useIsomorphicLayoutEffect(() => {
		if (isMeasuring) {
			return;
		}

		for (const action of hiddenActions) {
			if (!hiddenIdsRef.current.has(action.id)) {
				action.onHide?.();
			}
		}
		hiddenIdsRef.current = new Set(hiddenActions.map(({ id }) => id));

		// The dropdown unmounts without hidden actions; it must not come back already open
		if (!hiddenActions.length) {
			setIsDropdownOpen(false);
		}
	}, [isMeasuring, visibleCount]);

	const renderInTooltip = (trigger: ReactNode, tooltip: string): ReactElement => {
		return (
			<NoServerSideRendering>
				<Tooltip position="top" offset={10}>
					<TooltipTrigger>{trigger}</TooltipTrigger>
					<TooltipContent>{tooltip}</TooltipContent>
				</Tooltip>
			</NoServerSideRendering>
		);
	};
	// The link is the only tab stop and carries the name and click; the button inside it is not
	// interactive on its own, so there is no nested interactive content.
	const renderWithLink = (
		action: ActionItem,
		content: ReactNode,
		onClick: (id: MediaActions) => void
	): ReactNode =>
		action.url ? (
			<a
				href={action.url}
				target="_blank"
				referrerPolicy="no-referrer"
				rel="noreferrer"
				aria-label={action.customElement ? undefined : action.ariaLabel}
				onClick={() => onClick(action.id)}
			>
				{content}
			</a>
		) : (
			content
		);

	const renderPrimaryButton = (action: ActionItem) => {
		const $element = action.customElement ? (
			action.customElement
		) : (
			<Button
				variants={primaryButtonVariants}
				iconStart={action.icon}
				onClick={action.url ? undefined : () => onClickAction(action.id)}
				tabIndex={action.url ? -1 : undefined}
				aria-hidden={action.url ? true : undefined}
				ariaLabel={action.ariaLabel}
				// The label is cut off when there is little room, so the full text is available on hover
				title={action.tooltip ?? action.label}
			>
				<span className="u-text-ellipsis">{action.label}</span>
			</Button>
		);
		return (
			<li
				className={styles['c-dynamic-action-menu__primary-item']}
				key={`media-action-${action.id}`}
			>
				{renderWithLink(action, $element, onClickAction)}
			</li>
		);
	};

	const renderSecondaryButton = (action: ActionItem, index: number) => {
		const tooltip = isMobile ? undefined : action.tooltip;

		const $element = action.customElement ? (
			action.customElement
		) : (
			<Button
				onClick={action.url ? undefined : () => onClickAction(action.id)}
				tabIndex={action.url ? -1 : undefined}
				aria-hidden={action.url ? true : undefined}
				icon={action.icon}
				variants={secondaryButtonVariants}
				ariaLabel={action.ariaLabel}
				// The tooltip shows the same text; a title as well would announce and show it twice
				title={tooltip ? undefined : action.tooltip}
			/>
		);
		// The tooltip wraps the link, as that is what takes the focus
		const $item = renderWithLink(action, $element, onClickAction);

		return (
			<div
				key={`media-action-${action.id}`}
				{...{ [SECONDARY_ITEM_ATTRIBUTE]: '' }}
				className={clsx(styles['c-dynamic-action-menu__secondary-item'], {
					[styles['c-dynamic-action-menu__secondary-item--hidden']]:
						index >= visibleCount && !isMeasuring,
				})}
			>
				{tooltip ? renderInTooltip($item, tooltip) : $item}
			</div>
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
				id={dropdownId}
				placement="bottom-end"
			>
				<DropdownButton>
					<Button
						ref={dropdownButtonRef}
						// No aria-haspopup: the flyout is a list of buttons, not a role="menu"
						aria-expanded={isDropdownOpen}
						aria-controls={dropdownId}
						icon={<Icon name={IconNamesLight.DotsHorizontal} aria-hidden />}
						ariaLabel={tText(
							'modules/ie-objects/components/dynamic-action-menu/dynamic-action-menu___meer-acties'
						)}
						variants={secondaryButtonVariants}
					/>
				</DropdownButton>
				<DropdownContent>
					<MenuContent
						rootClassName="c-dropdown-menu"
						className={styles['c-dynamic-action-menu__dropdown-menu']}
						menuItems={mappedActions}
						onClick={(id) => onClickAction(id as MediaActions)}
					/>
				</DropdownContent>
			</Dropdown>
		);
	};

	return (
		<ul
			ref={listRef}
			className={clsx(className, styles['c-dynamic-action-menu'], {
				[styles['c-dynamic-action-menu--measuring']]: isMeasuring,
			})}
		>
			{primaryActions.map(renderPrimaryButton)}
			<li ref={secondaryRef} className={styles['c-dynamic-action-menu__secondary']}>
				{secondaryActions.map(renderSecondaryButton)}
				{!!hiddenActions.length && renderDropdown(hiddenActions)}
			</li>
		</ul>
	);
};

export default DynamicActionMenu;
