import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { VisitSpaceCount } from '@shared/types';
import { VisitsService } from '@visits/services';

export function useGetPendingVisitCountForUserBySlug(
	slug: string,
	enabled = false
): UseQueryResult<VisitSpaceCount> {
	return useQuery(
		[QUERY_KEYS.getPendingVisitCountForUserBySlug, { slug }],
		() => VisitsService.getPendingVisitCountForUserBySlug(slug),
		{ enabled }
	);
}
