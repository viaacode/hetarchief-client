import { ObjectDetailTabs } from '@ie-objects/ie-objects.types';
import { updateQueryParamsShallow } from '@ie-objects/utils/update-query-params-shallow';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SearchFilterId } from '@visitor-space/types';
import { useRouter } from 'next/router';
import { parseUrl } from 'query-string';
import { useCallback, useEffect, useState } from 'react';

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

	// Query params to change; undefined removes one
	const replaceQuery = useCallback(
		(patch: Record<string, string | undefined>) => updateQueryParamsShallow(router, patch),
		[router]
	);

	// Changes the tab and, in the same URL update, other query params: two updates in a row would
	// each start from the URL as it was and undo each other
	const updateActiveTab = useCallback(
		async (
			newActiveTab: ObjectDetailTabs | null,
			extraQuery: Record<string, string | undefined> = {}
		) => {
			const tab = newActiveTab || ObjectDetailTabs.Overview;
			setActiveTab(tab);
			await replaceQuery({ ...extraQuery, [QUERY_PARAM_KEY.ACTIVE_TAB]: tab });
		},
		[replaceQuery]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: only reset the tab when the object changes, not on every refetch
	useEffect(() => {
		if (!objectId) {
			return;
		}
		// Read from window.location, not useQueryParam (see updateActiveTab), on every object change.
		const { query } = parseUrl(window.location.href);
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

	return { activeTab, updateActiveTab, updateQueryParams: replaceQuery };
};

interface UseResetUnavailableTabProps {
	activeTab: ObjectDetailTabs;
	availableTabIds: ObjectDetailTabs[];
	isMobile: boolean;
	/** False while the data the tabs depend on is still loading */
	isReady: boolean;
	/** Also writes to the URL, so a reset tab never leaves a stale tab id behind in the address bar */
	updateActiveTab: (tab: ObjectDetailTabs) => Promise<void>;
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
