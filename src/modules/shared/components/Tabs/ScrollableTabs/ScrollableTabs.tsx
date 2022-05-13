import { getVariantsArray, Tabs, TabsProps } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { isBrowser } from '@shared/utils';

import styles from './ScrollableTabs.module.scss';

const ScrollableTabs: FC<TabsProps> = (props) => {
	const { tabs: items, className } = props;

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
		(element) => {
			if (!element) {
				return;
			}

			const containerEnd = Math.round(element.clientWidth);
			const leftOffset = Math.round(element.scrollLeft);
			const rightOffset = Math.round(element.scrollWidth - leftOffset);
			const showLeft = leftOffset > 0;
			const showRight = rightOffset > containerEnd;

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
		(e) => {
			setGradients(e.target);
		},
		[setGradients]
	);

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
						entries.forEach(({ target }) => {
							if (window.innerWidth < target.scrollWidth + 40) {
								setGradients(target);
							}
							if (target.clientHeight !== tabsHeight) {
								setHeight(target);
							}
						});
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
				getVariantsArray(props.variants).map(
					(variant) => styles[`c-scrollable-tabs--${variant}`]
				)
			)}
			style={{ height: `${tabsHeight}px` }}
		>
			<Tabs {...props} className={`${className}-tab`} />
		</div>
	);
};

export default ScrollableTabs;
