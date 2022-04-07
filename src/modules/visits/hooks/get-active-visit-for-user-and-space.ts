import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { Visit } from '@shared/types';
import { VisitsService } from '@visits/services';

export function useGetActiveVisitForUserAndSpace(
	spaceId: string,
	enabled = true
): UseQueryResult<Visit> {
	return useQuery(
		[QUERY_KEYS.getActiveVisitForUserAndSpace, { spaceId }],
		() => VisitsService.getActiveVisitForUserAndSpace(spaceId),
		{ enabled, retry: 0 }
	);
}
