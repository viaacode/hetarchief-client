import { Button, getVariantsArray, Tabs, type TabsProps } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { isBrowser } from '@shared/utils/is-browser';
import clsx from 'clsx';
import React, { type FC, useCallback, useEffect, useRef, useState } from 'react';

import styles from './ScrollableTabs.module.scss';

// Subpixel layout means the true scroll end doesn't always land exactly on scrollWidth -
// clientWidth; treat anything within this many px of it as "nothing left to scroll to".
const SCROLL_END_TOLERANCE_PX = 1;

export interface ScrollableTabsProps extends TabsProps {
	showNavButtons?: boolean;
}

const ScrollableTabs: FC<ScrollableTabsProps> = (props) => {
	const { tabs: items, className, showNavButtons = false, ...tabsProps } = props;

	/**
	 * Hooks
	 */
	const hasInitialised = useRef(false);
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const tabsRef = useRef<Element | null>(null);
	const [activeEl, setActiveEl] = useState<Element | null>(null);
	const [tabsHeight, setTabsHeight] = useState(0);
	const [showLeftGradient, setShowLeftGradient] = useState(false);
	const [showRightGradient, setShowRightGradient] = useState(false);

	// Hide horizontal scrollbar
	useEffect(() => {
		if (scrollContainerRef.current) {
			const tabsEl = scrollContainerRef.current.querySelector('.c-tabs');

			if (tabsEl) {
				tabsRef.current = tabsEl;
				setTabsHeight(tabsEl.clientHeight);
			}
		}
	}, []);

	// Set active element
	useEffect(() => {
		if (tabsRef.current && items.length) {
			setActiveEl(tabsRef.current.querySelector('.c-tab--active'));
		}
	}, [items]);

	// Scroll active tab into view
	const scrollToActive = useCallback(() => {
		if (activeEl && tabsRef.current) {
			const tabsEl = tabsRef.current;
			// - 20 = width of gradient, so the active tab will be fully visible
			const newX = (activeEl as HTMLDivElement).offsetLeft - 20;

			// scrollTo is not supported on IE and Safari (iOS)
			if (tabsEl.scrollTo) {
				tabsEl.scrollTo({ top: 0, left: newX, behavior: 'smooth' });
			} else {
				tabsEl.scrollLeft = newX;
			}
		}
	}, [activeEl]);

	// Set gradients to indicate it's scrollable
	const setGradients = useCallback(
		(element: Element) => {
			if (!element) {
				return;
			}

			// scrollLeft/scrollWidth/clientWidth can each carry their own subpixel fraction that
			// rounding independently (as this used to, via Math.round on each) can push to either
			// side depending on the exact remainder - at some container widths the true scroll end
			// rounded to 1px *past* clientWidth, leaving the arrow stuck visible even though there
			// was nothing left to scroll to. A tolerance band instead of rounding absorbs that.
			const rightOffset = element.scrollWidth - element.scrollLeft;
			const showLeft = element.scrollLeft > SCROLL_END_TOLERANCE_PX;
			const showRight = rightOffset > element.clientWidth + SCROLL_END_TOLERANCE_PX;

			if (showLeft !== showLeftGradient) {
				setShowLeftGradient(showLeft);
			}
			if (showRight !== showRightGradient) {
				setShowRightGradient(showRight);
			}
		},
		[showLeftGradient, showRightGradient]
	);

	const onTabsScroll = useCallback(
		(e: Event) => {
			if (e.target) {
				setGradients(e.target as Element);
			}
		},
		[setGradients]
	);

	// Scroll by roughly one screen's worth of tabs, like a carousel's next/prev controls. Covers
	// desktop too (not just mobile) since the tab strip can overflow there as well.
	const scrollByAmount = useCallback((direction: 'left' | 'right') => {
		const tabsEl = tabsRef.current as HTMLElement | null;
		if (!tabsEl) {
			return;
		}
		const amount = tabsEl.clientWidth * 0.8 * (direction === 'left' ? -1 : 1);
		const newX = tabsEl.scrollLeft + amount;

		// scrollTo is not supported on IE and Safari (iOS)
		if (tabsEl.scrollTo) {
			tabsEl.scrollTo({ top: 0, left: newX, behavior: 'smooth' });
		} else {
			tabsEl.scrollLeft = newX;
		}
	}, []);

	// Set scroll listener
	useEffect(() => {
		const tabsEl = tabsRef.current;

		if (tabsEl) {
			tabsEl.addEventListener('scroll', onTabsScroll);
		}

		return () => {
			if (tabsEl) {
				tabsEl.removeEventListener('scroll', onTabsScroll);
			}
		};
	}, [onTabsScroll]);

	// Set resize obeserver to update height and gradients
	useEffect(() => {
		let observer: ResizeObserver | undefined;

		if (scrollContainerRef.current) {
			const tabsEl = scrollContainerRef.current.querySelector('.c-tabs');

			const setHeight = (el: Element) => {
				setTabsHeight(el.clientHeight);
				tabsRef.current = el;
			};

			if (tabsEl) {
				if (isBrowser() && window.ResizeObserver) {
					observer = new ResizeObserver((entries) => {
						for (const entry of entries) {
							const target = entry.target as HTMLElement;
							// Recompute on every resize, not just when the window happens to be
							// narrower than the row's content: a row inside a narrow sidebar (like the
							// object detail page's) can overflow its own container while the window
							// itself stays far wider, so gating on window width left gradients stuck
							// at whatever they were before the resize (e.g. the sidebar being
							// expanded/collapsed, which resizes this row without the window moving).
							setGradients(target);
							if (target.clientHeight !== tabsHeight) {
								setHeight(target);
							}
						}
					});

					observer.observe(tabsEl);
				}

				setHeight(tabsEl);
			}
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, [tabsHeight, setGradients]);

	// Set initial values
	// biome-ignore lint/correctness/useExhaustiveDependencies: enough to set the initial values
	useEffect(() => {
		if (!hasInitialised.current && tabsRef.current) {
			setGradients(tabsRef.current);
			hasInitialised.current = true;
		}
	}, [items.length, setGradients]);

	useEffect(() => {
		if (items.length && hasInitialised.current && activeEl) {
			scrollToActive();
		}
	}, [activeEl, items.length, scrollToActive]);

	/**
	 * Render
	 */

	return (
		<div
			ref={scrollContainerRef}
			className={clsx(
				className,
				styles['c-scrollable-tabs'],
				{
					[styles['c-scrollable-tabs--gradient-left']]: showLeftGradient,
					[styles['c-scrollable-tabs--gradient-right']]: showRightGradient,
				},
				getVariantsArray(props.variants).map((variant) => styles[`c-scrollable-tabs--${variant}`])
			)}
			style={{ height: `${tabsHeight}px` }}
		>
			{showNavButtons && showLeftGradient && (
				<Button
					className={clsx(
						styles['c-scrollable-tabs__nav-button'],
						styles['c-scrollable-tabs__nav-button--left']
					)}
					icon={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
					ariaLabel={tText(
						'modules/shared/components/tabs/scrollable-tabs/scrollable-tabs___scroll-tabs-naar-links'
					)}
					onClick={() => scrollByAmount('left')}
				/>
			)}
			<Tabs {...tabsProps} tabs={items} className={`${className}-tab`} />
			{showNavButtons && showRightGradient && (
				<Button
					className={clsx(
						styles['c-scrollable-tabs__nav-button'],
						styles['c-scrollable-tabs__nav-button--right']
					)}
					icon={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
					ariaLabel={tText(
						'modules/shared/components/tabs/scrollable-tabs/scrollable-tabs___scroll-tabs-naar-rechts'
					)}
					onClick={() => scrollByAmount('right')}
				/>
			)}
		</div>
	);
};

export default ScrollableTabs;
