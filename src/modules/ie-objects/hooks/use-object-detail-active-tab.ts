import { ObjectDetailTabs } from '@ie-objects/ie-objects.types';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SearchFilterId } from '@visitor-space/types';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useQueryParams } from 'use-query-params';

interface UseObjectDetailActiveTabProps {
	/** Changing this (navigating to another object) re-applies the default tab */
	objectId: string | undefined;
	isNewspaper: boolean;
}

/**
 * Default tab per FA scenario: Overview, except Metadata (where the namenlijst lives) for
 * newspapers opened with a namenlijst filter. For newspapers with a search term, the alto-content
 * effect in ObjectDetailPage switches to Ocr once OCR text is available.
 */
export const getDefaultObjectDetailTab = (
	isNewspaper: boolean,
	hasNamenlijstFilter: boolean
): ObjectDetailTabs =>
	isNewspaper && hasNamenlijstFilter ? ObjectDetailTabs.Metadata : ObjectDetailTabs.Overview;

/** A tab id from the URL is untrusted: it can be junk or, when repeated, an array */
export const parseObjectDetailTab = (value: unknown): ObjectDetailTabs | undefined =>
	Object.values(ObjectDetailTabs).find((tab) => tab === value);

export const useObjectDetailActiveTab = ({
	objectId,
	isNewspaper,
}: UseObjectDetailActiveTabProps) => {
	const router = useRouter();
	// Seeded from router.query (also available during SSR) so a deep link doesn't paint Overview first
	const [activeTab, setActiveTab] = useState<ObjectDetailTabs>(
		() =>
			parseObjectDetailTab(router.query[QUERY_PARAM_KEY.ACTIVE_TAB]) ?? ObjectDetailTabs.Overview
	);

	const [, setQueryParams] = useQueryParams({});

	// Query params to change; undefined removes one
	const replaceQuery = useCallback(
		(patch: Record<string, string | undefined>) => setQueryParams(patch, 'replaceIn'),
		[setQueryParams]
	);

	// Changes the tab and, in the same URL update, other query params
	const updateActiveTab = useCallback(
		(
			newActiveTab: ObjectDetailTabs | null,
			extraQuery: Record<string, string | undefined> = {}
		) => {
			const tab = newActiveTab || ObjectDetailTabs.Overview;
			setActiveTab(tab);
			replaceQuery({ ...extraQuery, [QUERY_PARAM_KEY.ACTIVE_TAB]: tab });
		},
		[replaceQuery]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: only reset the tab when the object changes, not on every refetch
	useEffect(() => {
		if (!objectId) {
			return;
		}
		// Read the url once per object change, so later url updates don't re-apply the default tab
		const { query } = queryString.parseUrl(window.location.href);
		// An explicit tab in the URL (deep link / bookmark / link to another object) wins
		const activeTabFromUrl = parseObjectDetailTab(query[QUERY_PARAM_KEY.ACTIVE_TAB]);
		if (activeTabFromUrl) {
			setActiveTab(activeTabFromUrl);
			return;
		}
		// State only: writing the default to the URL would race other query param updates and
		// pollute shared links
		const namenlijstFilter = query[SearchFilterId.Mentions];
		const hasNamenlijstFilter = Array.isArray(namenlijstFilter)
			? namenlijstFilter.length > 0
			: !!namenlijstFilter;
		setActiveTab(getDefaultObjectDetailTab(isNewspaper, hasNamenlijstFilter));
	}, [objectId]);

	return {
		activeTab,
		updateActiveTab,
		// State only, for tab changes that follow from the url itself (eg: search terms on page load):
		// writing those back would change the url right after loading, a client side redirect for search engines
		setActiveTabWithoutUrlUpdate: setActiveTab,
		updateQueryParams: replaceQuery,
	};
};

interface UseResetUnavailableTabProps {
	activeTab: ObjectDetailTabs;
	availableTabIds: ObjectDetailTabs[];
	isMobile: boolean;
	/** False while the data the tabs depend on is still loading */
	isReady: boolean;
	/** Also writes to the URL, so a reset tab never leaves a stale tab id behind in the address bar */
	updateActiveTab: (tab: ObjectDetailTabs) => void;
}

/**
 * A tab from the URL (or an old bookmark) may not exist for this object, e.g. ocr without
 * transcripts or related without related objects: fall back to Overview.
 */
export const useResetUnavailableTab = ({
	activeTab,
	availableTabIds,
	isMobile,
	isReady,
	updateActiveTab,
}: UseResetUnavailableTabProps) => {
	useEffect(() => {
		if (!isReady) {
			return;
		}
		// The media tab exists in the list but is only rendered on mobile
		const isTabUnavailable =
			!availableTabIds.includes(activeTab) || (activeTab === ObjectDetailTabs.Media && !isMobile);
		if (isTabUnavailable) {
			updateActiveTab(ObjectDetailTabs.Overview);
		}
	}, [isReady, availableTabIds, activeTab, isMobile, updateActiveTab]);
};
