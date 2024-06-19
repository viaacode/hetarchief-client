import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { type Visit } from '@shared/types';
import { VisitsService } from '@visit-requests/services';
import { type GetAllActiveVisitsProps } from '@visit-requests/services/visits/visits.service.types';

export function useGetAllActiveVisits(
	props: GetAllActiveVisitsProps,
	options: {
		keepPreviousData: boolean;
		enabled: boolean;
	} = {
		keepPreviousData: true,
		enabled: true,
	}
): UseQueryResult<IPagination<Visit>> {
	return useQuery(
		[QUERY_KEYS.getVisits, props],
		() => VisitsService.getAllActiveVisits(props),
		options
	);
}
