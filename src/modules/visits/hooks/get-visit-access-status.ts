import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

import { QUERY_KEYS } from '@shared/const';
import { VisitAccessStatus } from '@shared/types';
import { VisitsService } from '@visits/services';

export function useGetVisitAccessStatus(slug: string): UseQueryResult<VisitAccessStatus | null> {
	return useQuery([QUERY_KEYS.getVisitAccessStatus, { slug }], () =>
		VisitsService.getAccessStatusBySpaceSlug(slug)
	);
}

export function useGetVisitAccessStatusMutation(): UseMutationResult<
	VisitAccessStatus | null,
	unknown,
	string
> {
	return useMutation((slug: string) => VisitsService.getAccessStatusBySpaceSlug(slug));
}
