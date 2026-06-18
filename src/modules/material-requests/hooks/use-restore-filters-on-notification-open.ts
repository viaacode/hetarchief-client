import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export const useRestoreFiltersOnNotificationOpen = <T extends Record<string, unknown>>(
	currentMaterialRequestId: string | null | undefined,
	filters: T,
	setFilters: (updater: (current: T) => T) => void,
	setUiState: {
		setSearch: (v: string) => void;
		setSelectedTypes: (v: string[]) => void;
		setSelectedStatuses: (v: string[]) => void;
		setSelectedDownloadFilters: (v: string[]) => void;
		setShowArchived: (v: boolean) => void;
	}
) => {
	const router = useRouter();
	const previousFiltersRef = useRef<T | null>(null);

	const hasOnlyMaterialRequestQueryParam =
		!!currentMaterialRequestId &&
		Object.keys(router.query).length > 0 &&
		Object.keys(router.query).every((key) => key === QUERY_PARAM_KEY.MATERIAL_REQUEST);

	// Snapshot the current filter state whenever we are NOT in the notification-open state.
	useEffect(() => {
		if (hasOnlyMaterialRequestQueryParam) {
			return;
		}

		previousFiltersRef.current = { ...filters };
	}, [hasOnlyMaterialRequestQueryParam, filters]);

	// When a notification opens this page with only `materialRequest` in the URL,
	// restore the previously snapshotted filter state.
	useEffect(() => {
		const previousFilters = previousFiltersRef.current;

		if (!hasOnlyMaterialRequestQueryParam || !previousFilters) {
			return;
		}

		const {
			setSearch,
			setSelectedTypes,
			setSelectedStatuses,
			setSelectedDownloadFilters,
			setShowArchived,
		} = setUiState;

		setSearch((previousFilters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] as string) || '');
		setSelectedTypes((previousFilters[QUERY_PARAM_KEY.TYPE] as string[]) || []);
		setSelectedStatuses((previousFilters[QUERY_PARAM_KEY.STATUS] as string[]) || []);
		setSelectedDownloadFilters(
			(previousFilters[QUERY_PARAM_KEY.HAS_DOWNLOAD_URL] as string[]) || []
		);
		setShowArchived(previousFilters[QUERY_PARAM_KEY.IS_ARCHIVED] === 'true');

		setFilters((current) => ({ ...current, ...previousFilters }));
	}, [hasOnlyMaterialRequestQueryParam, setFilters, setUiState]);
};
