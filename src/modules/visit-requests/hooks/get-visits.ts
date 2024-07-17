import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { type Visit } from '@shared/types/visit';
import { VisitsService } from '@visit-requests/services';
import { type GetVisitsProps } from '@visit-requests/services/visits/visits.service.types';

export function useGetVisits(
	props: GetVisitsProps,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = { keepPreviousData: true }
): UseQueryResult<IPagination<Visit>> {
	return useQuery([QUERY_KEYS.getVisits, props], () => VisitsService.getAll(props), options);
}
