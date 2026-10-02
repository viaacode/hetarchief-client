import { ObjectDetailPageHeader } from '@ie-objects/components/ObjectDetailPageHeader/ObjectDetailPageHeader';
import { ObjectDetailTabs } from '@ie-objects/ie-objects.types';
import clsx from 'clsx';
import React, { type FC, useEffect, useRef, useState } from 'react';
import styles from './ObjectDetailPageSidebar.module.scss';
import type { ObjectDetailPageSidebarProps } from './ObjectDetailPageSidebar.types';

// 1px tolerance for sub-pixel rounding, not an exact 0 comparison.
const hasScrollOverflow = (el: HTMLElement): boolean => el.scrollHeight - el.clientHeight > 1;

export const ObjectDetailPageSidebar: FC<ObjectDetailPageSidebarProps> = ({
	mediaInfo,
	onClickAction,
	hasAccessToVisitorSpaceOfObject,
	currentPageIndex,
	onReadMoreClicked,
	activeTab,
	similar,
	tabs,
	containerRef,
	isProgrammaticScrollRef,
	className,
	children,
}) => {
	// Compact ("beperkte") header state, toggled by the sentinel IntersectionObserver below.
	const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
	const headerCollapseSentinelRef = useRef<HTMLDivElement>(null);
	// Ref, not state: touchmove fires far too often to put through a render.
	const touchStartYRef = useRef<number | null>(null);

	// Shared by the explicit "Toon details" click and the scroll-intent handlers below.
	const expandHeader = () => {
		// Set directly rather than relying on scroll-to-top to re-trigger the sentinel's observer:
		// it deliberately ignores the sentinel re-entering view on a tab with no scrollbar (see its
		// own comment), which would otherwise also block this trigger.
		setIsHeaderCollapsed(false);
		// 'auto' (instant), not 'smooth': smooth scrolling races the header's own concurrent
		// max-height transition and can settle a few px short of 0, leaving the sentinel just out of
		// view - the observer then never sees it re-enter, and the header can no longer collapse on
		// a later scroll.
		containerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
	};

	// The sentinel is always mounted (only its CSS visibility changes across tabs), so this only
	// needs to run once.
	useEffect(() => {
		const root = containerRef.current;
		const sentinel = headerCollapseSentinelRef.current;
		if (!root || !sentinel) {
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// Ignore a re-intersection caused by our own collapse clamping scrollTop back to
					// 0 on a short tab (no real overflow) - re-expanding would recreate the overflow
					// that triggered the collapse, which the clamp immediately undoes again, looping
					// forever and leaving short tabs (e.g. Overzicht) unable to reach their content.
					if (!hasScrollOverflow(root)) {
						return;
					}
					// Ignore a re-intersection caused by a child auto-scrolling the container itself
					// (e.g. ObjectDetailPageOcrTab jumping to a search result that happens to sit near
					// the top of its page) - that's not the user scrolling back up.
					if (isProgrammaticScrollRef.current) {
						return;
					}
				}
				setIsHeaderCollapsed(!entry.isIntersecting);
			},
			{ root, threshold: 0 }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [containerRef, isProgrammaticScrollRef]);

	// A short tab with no overflow never fires a scroll event, so the sentinel above never
	// re-triggers; these catch the user's scroll-up attempt in that case instead. Passive by React's
	// default (no preventDefault), so native scrolling is unaffected.
	const maybeExpandOnScrollUpIntent = (container: HTMLDivElement, isUpwardIntent: boolean) => {
		if (!isHeaderCollapsed || !isUpwardIntent || hasScrollOverflow(container)) {
			return;
		}
		expandHeader();
	};

	const handleSidebarWheel = (event: React.WheelEvent<HTMLDivElement>) => {
		maybeExpandOnScrollUpIntent(event.currentTarget, event.deltaY < 0);
	};

	const handleSidebarTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
		touchStartYRef.current = event.touches[0]?.clientY ?? null;
	};

	const handleSidebarTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
		const currentY = event.touches[0]?.clientY;
		if (touchStartYRef.current === null || currentY === undefined) {
			return;
		}
		// Swiping down (finger moves down the screen) is a scroll-up intent.
		maybeExpandOnScrollUpIntent(event.currentTarget, currentY > touchStartYRef.current);
		touchStartYRef.current = currentY;
	};

	// 1px (not 0) keeps the sentinel out of view on tab switch, so the header stays collapsed and
	// scrolling up can still expand it - a short tab would otherwise clamp scrollTop back to 0.
	// biome-ignore lint/correctness/useExhaustiveDependencies: only on tab change, not when the header collapses
	useEffect(() => {
		const container = containerRef.current;
		if (isHeaderCollapsed && container) {
			container.scrollTo({ top: 1, behavior: 'auto' });
		}
	}, [activeTab]);

	return (
		<div className={clsx(styles['c-object-detail-sidebar'], className)}>
			<div
				ref={containerRef}
				onWheel={handleSidebarWheel}
				onTouchStart={handleSidebarTouchStart}
				onTouchMove={handleSidebarTouchMove}
				className={clsx(
					styles['c-object-detail-sidebar__content'],
					styles[`c-object-detail-sidebar__content--tab-${activeTab}`],
					{
						// Both end in a card list that paints its own padding/background
						[styles['c-object-detail-sidebar__content--ends-in-list']]:
							(activeTab === ObjectDetailTabs.Overview && similar.length > 0) ||
							activeTab === ObjectDetailTabs.Related,
					}
				)}
			>
				{/* Sentinel that drives the header's collapse - see the IntersectionObserver effect above */}
				<div ref={headerCollapseSentinelRef} />
				<div
					className={clsx(styles['c-object-detail-sidebar__sticky'], {
						[styles['c-object-detail-sidebar__sticky--scrolled']]: isHeaderCollapsed,
					})}
				>
					{activeTab !== ObjectDetailTabs.Media && (
						<ObjectDetailPageHeader
							mediaInfo={mediaInfo}
							onClickAction={onClickAction}
							hasAccessToVisitorSpaceOfObject={hasAccessToVisitorSpaceOfObject}
							currentPageIndex={currentPageIndex}
							isCollapsed={isHeaderCollapsed}
							onShowDetails={expandHeader}
							onReadMoreClicked={onReadMoreClicked}
						/>
					)}
					{tabs}
				</div>
				{children}
			</div>
		</div>
	);
};
