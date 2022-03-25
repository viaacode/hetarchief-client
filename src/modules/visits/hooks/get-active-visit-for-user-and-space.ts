import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { VisitInfo } from '@shared/types';
import { VisitsService } from '@visits/services';

export function useGetActiveVisitForUserAndSpace(spaceId: string): UseQueryResult<VisitInfo> {
	return useQuery([QUERY_KEYS.getActiveVisitForUserAndSpace, { spaceId }], () =>
		VisitsService.getActiveVisitForUserAndSpace(spaceId)
	);
}
