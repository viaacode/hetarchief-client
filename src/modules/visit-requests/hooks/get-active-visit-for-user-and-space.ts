import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { User } from '@auth/types';
import { VisitsService } from '@modules/visit-requests/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { Visit } from '@shared/types';

export function useGetActiveVisitForUserAndSpace(
	visitorSpaceSlug: string,
	user: User | null | undefined,
	enabled = true
): UseQueryResult<Visit> {
	return useQuery(
		[QUERY_KEYS.getActiveVisitForUserAndSpace, { spaceId: visitorSpaceSlug, user }],
		() => {
			if (!user) {
				return null; // Anonymous users can never have an active visit request
			}
			return VisitsService.getActiveVisitForUserAndSpace(visitorSpaceSlug);
		},
		{ enabled, retry: 0 }
	);
}