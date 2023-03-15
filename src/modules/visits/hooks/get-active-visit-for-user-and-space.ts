import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { User } from '@auth/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { Visit } from '@shared/types';
import { VisitsService } from '@visits/services';

export function useGetActiveVisitForUserAndSpace(
	spaceId: string,
	user: User | null | undefined,
	enabled = true
): UseQueryResult<Visit> {
	return useQuery(
		[QUERY_KEYS.getActiveVisitForUserAndSpace, { spaceId, user }],
		() => {
			if (!user) {
				return null; // Anonymous users can never have an active visit request
			}
			return VisitsService.getActiveVisitForUserAndSpace(spaceId);
		},
		{ enabled, retry: 0 }
	);
}
