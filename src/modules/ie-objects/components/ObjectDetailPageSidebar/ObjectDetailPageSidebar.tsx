import { ObjectDetailPageHeader } from '@ie-objects/components/ObjectDetailPageHeader/ObjectDetailPageHeader';
import { ObjectDetailTabs } from '@ie-objects/ie-objects.types';
import clsx from 'clsx';
import React, {
	type CSSProperties,
	type FC,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import styles from './ObjectDetailPageSidebar.module.scss';
import type { ObjectDetailPageSidebarProps } from './ObjectDetailPageSidebar.types';

export const ObjectDetailPageSidebar: FC<ObjectDetailPageSidebarProps> = ({
	mediaInfo,
	onClickAction,
	hasAccessToVisitorSpaceOfObject,
	currentPageIndex,
	onReadMoreClicked,
	activeTab,
	similar,
	hasFeedbackButton = false,
	tabs,
	containerRef,
	className,
	children,
}) => {
	// Compact ("beperkte") header state, toggled by the sentinel IntersectionObserver below.
	const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
	const headerCollapseSentinelRef = useRef<HTMLDivElement>(null);
	// The header scrolls away with the content, and the sticky unit pins once only the compact bar's
	// height of it is left on screen: that scroll distance is both its (negative) sticky `top` and
	// where the sentinel sits. The header keeps its size when collapsing, so nothing shifts.
	const [collapseOffset, setCollapseOffset] = useState(0);
	// The media tab renders no header, so there the unit pins right at the top and the sentinel sits
	// there too. The reported offset is deliberately kept across tabs (not reset when the header
	// unmounts), so switching back doesn't need to wait for a new measurement.
	const effectiveCollapseOffset = activeTab === ObjectDetailTabs.Media ? 0 : collapseOffset;

	// Smooth is safe here: collapsing doesn't resize anything, so there is no layout change to race.
	const expandHeader = () => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		containerRef.current?.scrollTo({
			top: 0,
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
		});
	};

	// The sentinel is always mounted (only its CSS visibility changes across tabs), so this only
	// needs to run once. The collapsed state purely mirrors the scroll position - the header is
	// physically on screen exactly when it is expanded - so there is nothing to guard against here.
	useEffect(() => {
		const root = containerRef.current;
		const sentinel = headerCollapseSentinelRef.current;
		if (!root || !sentinel) {
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => setIsHeaderCollapsed(!entry.isIntersecting),
			{ root, threshold: 0 }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [containerRef]);

	// The container keeps its scrollTop across tabs, which would land the user mid-way the new tab.
	// Instead, a collapsed header stays collapsed and the new tab starts at its own top (1px past the
	// sentinel keeps it out of view). Layout effect: an effect after paint would flash the stale
	// position for a frame.
	// biome-ignore lint/correctness/useExhaustiveDependencies: only on tab change, not when the header collapses
	useLayoutEffect(() => {
		if (isHeaderCollapsed) {
			containerRef.current?.scrollTo({ top: effectiveCollapseOffset + 1, behavior: 'auto' });
		}
	}, [activeTab]);

	return (
		<div className={clsx(styles['c-object-detail-sidebar'], className)}>
			<div
				ref={containerRef}
				style={{ '--collapse-offset': `${effectiveCollapseOffset}px` } as CSSProperties}
				className={clsx(
					styles['c-object-detail-sidebar__content'],
					styles[`c-object-detail-sidebar__content--tab-${activeTab}`],
					{
						[styles['c-object-detail-sidebar__content--with-feedback-button']]: hasFeedbackButton,
						// Both end in a card list that paints its own padding/background
						[styles['c-object-detail-sidebar__content--ends-in-list']]:
							(activeTab === ObjectDetailTabs.Overview && similar.length > 0) ||
							activeTab === ObjectDetailTabs.Related,
					}
				)}
			>
				{/* Sentinel that drives the header's collapse - see the IntersectionObserver effect above */}
				<div
					ref={headerCollapseSentinelRef}
					className={styles['c-object-detail-sidebar__collapse-sentinel']}
					style={{ top: effectiveCollapseOffset }}
				/>
				<div
					className={clsx(styles['c-object-detail-sidebar__sticky'], {
						[styles['c-object-detail-sidebar__sticky--scrolled']]: isHeaderCollapsed,
					})}
					style={{ top: -effectiveCollapseOffset }}
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
							onCollapseOffsetChange={setCollapseOffset}
						/>
					)}
					{tabs}
				</div>
				{children}
			</div>
		</div>
	);
};
