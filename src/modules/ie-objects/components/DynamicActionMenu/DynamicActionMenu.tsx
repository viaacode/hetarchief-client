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
import useIsomorphicLayoutEffect from '@shared/hooks/use-isomorphic-layout-effect';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { isMobileSize } from '@shared/utils/is-mobile';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import clsx from 'clsx';
import { type FC, type ReactElement, type ReactNode, useRef, useState } from 'react';

import styles from './DynamicActionMenu.module.scss';
import type { ActionItem, DynamicActionMenuProps } from './DynamicActionMenu.types';

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
	const containerWidth = useElementSize(listRef)?.width;
	// The secondary buttons (in a client-only tooltip) appear a render after mount, so their
	// width is part of what has to trigger a re-measure
	const secondaryWidth = useElementSize(secondaryRef)?.width;

	const windowSize = useWindowSizeContext();
	const isMobile = isMobileSize(windowSize);

	const primaryActions = actions.filter(({ isPrimary }: ActionItem) => isPrimary);
	const secondaryActions = actions.filter(({ isPrimary }: ActionItem) => !isPrimary);

	// As many secondary actions as fit stay visible; the rest move into the dropdown. What fits is
	// measured on the full layout: every change that can affect it first renders that layout
	// (isMeasuring, unshrinkable primary) and reads the result before paint, so there is no flicker
	// and no feedback loop. The secondary buttons stay mounted (hidden) when they don't fit, so
	// their width stays measurable.
	const [isMeasuring, setIsMeasuring] = useState(true);
	const [visibleCount, setVisibleCount] = useState(secondaryActions.length);

	useIsomorphicLayoutEffect(() => {
		setIsMeasuring(true);
	}, [containerWidth, secondaryWidth, actions, isMobile]);

	useIsomorphicLayoutEffect(() => {
		const list = listRef.current;
		const secondary = secondaryRef.current;
		if (!isMeasuring || !list || !secondary) {
			return;
		}

		const items = Array.from(secondary.children) as HTMLElement[];
		const itemWidth = items.at(-1)?.offsetWidth ?? 0;
		// Not mounted yet; the width change once they are triggers a new measurement
		if (items.length < 2 || !itemWidth) {
			setVisibleCount(items.length);
			setIsMeasuring(false);
			return;
		}

		const gap = Number.parseFloat(getComputedStyle(items[0]).paddingRight);
		const primaryWidth = Array.from(list.children).reduce(
			(width, child) => (child === secondary ? width : width + (child as HTMLElement).offsetWidth),
			0
		);
		const fitsAll =
			primaryWidth + items.length * itemWidth + (items.length - 1) * gap <= list.clientWidth;

		// Otherwise the last visible button is followed by the dropdown button, which is as wide
		const fittingCount = Math.floor(
			(list.clientWidth - primaryWidth - itemWidth) / (itemWidth + gap)
		);
		setVisibleCount(fitsAll ? items.length : Math.max(0, Math.min(items.length - 1, fittingCount)));
		setIsMeasuring(false);
	}, [isMeasuring]);

	const hiddenActions = isMeasuring ? [] : secondaryActions.slice(visibleCount);

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

	const renderPrimaryButton = (action: ActionItem) => {
		const $element = action.customElement ? (
			action.customElement
		) : (
			<Button
				variants={primaryButtonVariants}
				iconStart={action.icon}
				onClick={() => onClickAction(action.id)}
				ariaLabel={action.ariaLabel}
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

	const renderSecondaryButton = (action: ActionItem, index: number) => {
		const itemClassName = clsx(styles['c-dynamic-action-menu__secondary-item'], {
			[styles['c-dynamic-action-menu__secondary-item--hidden']]:
				index >= visibleCount && !isMeasuring,
		});

		const $element = action.customElement ? (
			action.customElement
		) : (
			<Button
				onClick={() => onClickAction(action.id)}
				icon={action.icon}
				variants={secondaryButtonVariants}
				ariaLabel={action.ariaLabel}
				title={action.tooltip}
			/>
		);

		if (action.url) {
			return (
				<div className={itemClassName} key={`media-action-${action.id}`}>
					<a href={action.url} target="_blank" referrerPolicy="no-referrer" rel="noreferrer">
						{action.tooltip && !isMobile ? renderInTooltip($element, action.tooltip) : $element}
					</a>
				</div>
			);
		}
		return (
			<div className={itemClassName} key={`media-action-${action.id}`}>
				{action.tooltip && !isMobile ? renderInTooltip($element, action.tooltip) : $element}
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
				id={`dynamic-action-menu--${id}`}
				placement="bottom-end"
			>
				<DropdownButton>
					<Button
						className={styles['c-dynamic-action-menu__dropdown-button']}
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
