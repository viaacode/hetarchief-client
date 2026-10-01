import { Button, getVariantsArray, Tabs, type TabsProps } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { isBrowser } from '@shared/utils/is-browser';
import clsx from 'clsx';
import React, { type FC, useCallback, useEffect, useRef, useState } from 'react';

import styles from './ScrollableTabs.module.scss';

// Subpixel layout: the scroll end can miss scrollWidth - clientWidth by a fraction
const SCROLL_END_TOLERANCE_PX = 1;

// Keep in sync with $nav-button-width in ScrollableTabs.module.scss (6.4rem at the 62.5% root size)
const NAV_BUTTON_WIDTH_PX = 64;
// Width of the edge-fade gradient
const EDGE_FADE_WIDTH_PX = 20;

const getScrollBehavior = (): ScrollBehavior =>
	isBrowser() && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
		? 'auto'
		: 'smooth';

export interface ScrollableTabsProps extends TabsProps {
	showNavButtons?: boolean;
}

const ScrollableTabs: FC<ScrollableTabsProps> = (props) => {
	const { tabs: items, className, showNavButtons = false, ...tabsProps } = props;

	/**
	 * Hooks
	 */
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const tabsRef = useRef<Element | null>(null);
	const lastTabsHeightRef = useRef(0);
	const shouldRealignRef = useRef(false);
	const clickedNavButtonRef = useRef<'left' | 'right' | null>(null);
	const leftButtonRef = useRef<HTMLButtonElement | null>(null);
	const rightButtonRef = useRef<HTMLButtonElement | null>(null);
	const [activeEl, setActiveEl] = useState<Element | null>(null);
	const [tabsHeight, setTabsHeight] = useState(0);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

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
			// Leave room for whatever overlays the left edge, so the active tab is fully visible
			const leftInset = showNavButtons ? NAV_BUTTON_WIDTH_PX : EDGE_FADE_WIDTH_PX;
			const newX = (activeEl as HTMLDivElement).offsetLeft - leftInset;

			shouldRealignRef.current = true;
			tabsEl.scrollTo({ top: 0, left: newX, behavior: getScrollBehavior() });
		}
	}, [activeEl, showNavButtons]);

	// Set gradients to indicate it's scrollable
	const setGradients = useCallback((element: Element) => {
		if (!element) {
			return;
		}

		// Tolerance instead of rounding: independent rounding left the right arrow stuck visible
		const rightOffset = element.scrollWidth - element.scrollLeft;
		const showLeft = element.scrollLeft > SCROLL_END_TOLERANCE_PX;
		const showRight = rightOffset > element.clientWidth + SCROLL_END_TOLERANCE_PX;

		setCanScrollLeft(showLeft);
		setCanScrollRight(showRight);
	}, []);

	const onTabsScroll = useCallback(
		(e: Event) => {
			if (e.target) {
				setGradients(e.target as Element);
			}
		},
		[setGradients]
	);

	// Scroll by roughly one screen's worth of tabs
	const scrollByAmount = useCallback((direction: 'left' | 'right') => {
		clickedNavButtonRef.current = direction;
		shouldRealignRef.current = false;
		const tabsEl = tabsRef.current as HTMLElement | null;
		if (!tabsEl) {
			return;
		}
		const amount = tabsEl.clientWidth * 0.8 * (direction === 'left' ? -1 : 1);
		const newX = tabsEl.scrollLeft + amount;
		tabsEl.scrollTo({ top: 0, left: newX, behavior: getScrollBehavior() });
	}, []);

	// A nav button unmounts once its end is reached, which would drop keyboard focus on <body>
	useEffect(() => {
		const clicked = clickedNavButtonRef.current;
		const isClickedButtonGone = clicked === 'left' ? !canScrollLeft : !canScrollRight;
		if (!clicked || !isClickedButtonGone) {
			return;
		}
		clickedNavButtonRef.current = null;
		if (document.activeElement && document.activeElement !== document.body) {
			return;
		}
		(clicked === 'left' ? rightButtonRef : leftButtonRef).current?.focus();
	}, [canScrollLeft, canScrollRight]);

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

	// The tabs' widths can still grow after the first paint (webfont, counts), which raises the max
	// scroll position: the one-off scroll to the active tab then stops short, under the nav button.
	// Re-align on tab resizes until the user takes over.
	// biome-ignore lint/correctness/useExhaustiveDependencies: items re-subscribes the observer to newly added tabs
	useEffect(() => {
		const tabsEl = tabsRef.current;
		if (!tabsEl || !isBrowser() || !window.ResizeObserver) {
			return;
		}
		const stopRealigning = () => {
			shouldRealignRef.current = false;
		};
		const observer = new ResizeObserver(() => {
			// A tab growing (label, count, webfont) changes the overflow without resizing the row
			setGradients(tabsEl);
			if (shouldRealignRef.current) {
				scrollToActive();
			}
		});
		for (const tab of tabsEl.querySelectorAll('.c-tab')) {
			observer.observe(tab);
		}
		for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
			tabsEl.addEventListener(type, stopRealigning, { passive: true });
		}

		return () => {
			observer.disconnect();
			for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
				tabsEl.removeEventListener(type, stopRealigning);
			}
		};
		// items: tabs added later (e.g. Related after its fetch) must be observed too
	}, [scrollToActive, setGradients, items]);

	// Set resize obeserver to update height and gradients
	useEffect(() => {
		let observer: ResizeObserver | undefined;

		if (scrollContainerRef.current) {
			const tabsEl = scrollContainerRef.current.querySelector('.c-tabs');

			const setHeight = (el: Element) => {
				lastTabsHeightRef.current = el.clientHeight;
				setTabsHeight(el.clientHeight);
				tabsRef.current = el;
			};

			if (tabsEl) {
				if (isBrowser() && window.ResizeObserver) {
					observer = new ResizeObserver((entries) => {
						for (const entry of entries) {
							const target = entry.target as HTMLElement;
							// Not gated on window width: a row in a narrow sidebar can overflow while the window is wide
							setGradients(target);
							if (target.clientHeight !== lastTabsHeightRef.current) {
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
	}, [setGradients]);

	// Tabs can appear or change label after mount (e.g. a count): the row's own box doesn't resize
	// for that, so the ResizeObserver misses it and the arrows would go stale
	// biome-ignore lint/correctness/useExhaustiveDependencies: items re-runs this when tabs change
	useEffect(() => {
		if (tabsRef.current) {
			setGradients(tabsRef.current);
		}
	}, [setGradients, items]);

	useEffect(() => {
		if (items.length && activeEl) {
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
					[styles['c-scrollable-tabs--gradient-left']]: canScrollLeft,
					[styles['c-scrollable-tabs--gradient-right']]: canScrollRight,
				},
				getVariantsArray(props.variants).map((variant) => styles[`c-scrollable-tabs--${variant}`])
			)}
			style={{ height: `${tabsHeight}px` }}
		>
			{showNavButtons && canScrollLeft && (
				<Button
					ref={leftButtonRef}
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
			{showNavButtons && canScrollRight && (
				<Button
					ref={rightButtonRef}
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
