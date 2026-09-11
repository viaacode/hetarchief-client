import { GroupName } from '@account/const';
import { selectIsLoggedIn, selectUser } from '@auth/store/user';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import type { IeObjectsSearchFilter } from '@shared/types/ie-objects';
import type { VisitRequest } from '@shared/types/visit-request';
import { VisitStatus } from '@shared/types/visit-request';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { useGetActiveVisitRequestForUserAndSpace } from '@visit-requests/hooks/get-active-visit-request-for-user-and-space';
import { useGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';
import { VisitTimeframe } from '@visit-requests/types';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { SearchFilterId } from '@visitor-space/types';
import { mapFiltersToElastic, mapMaintainerToElastic } from '@visitor-space/utils/elastic-filters';
import { sortBy } from 'es-toolkit/compat';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

/**
 * The current search page url as elasticsearch filters, maintainer access included.
 * Used by every component that has to run a search of its own next to the result list,
 * for example a filter that loads its options.
 */
export const useSearchQueryFilters = (): IeObjectsSearchFilter[] => {
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const isAnonymousUser = useHasAnyGroup(GroupName.ANONYMOUS);
	const isUserWithAccount = isLoggedIn && !!user && !isAnonymousUser;

	const { data: visitRequestsPaginated } = useGetVisitRequests(
		{
			page: 1,
			size: 100,
			orderProp: 'startAt',
			orderDirection: AvoSearchOrderDirection.DESC,
			status: VisitStatus.APPROVED,
			timeframe: VisitTimeframe.ACTIVE,
			personal: true,
		},
		{ enabled: !!user }
	);

	const { data: activeVisitRequest } = useGetActiveVisitRequestForUserAndSpace(
		query[SearchFilterId.Maintainer],
		user
	);

	const accessibleVisitorSpaceRequests: VisitRequest[] = useMemo(
		() =>
			isUserWithAccount
				? sortBy(visitRequestsPaginated?.items || [], (visitRequest) =>
						visitRequest.spaceName?.toLowerCase()
					)
				: [],
		[isUserWithAccount, visitRequestsPaginated?.items]
	);

	return useMemo(
		() => [
			...mapMaintainerToElastic(query, activeVisitRequest, accessibleVisitorSpaceRequests),
			...mapFiltersToElastic(query),
		],
		[query, activeVisitRequest, accessibleVisitorSpaceRequests]
	);
};
