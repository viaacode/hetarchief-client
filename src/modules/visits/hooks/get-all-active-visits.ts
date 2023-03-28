import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { Visit } from '@shared/types';
import { VisitsService } from '@visits/services';
import { GetAllActiveVisitsProps } from '@visits/services/visits/visits.service.types';

export function useGetAllActiveVisits(
	props: GetAllActiveVisitsProps
): UseQueryResult<IPagination<Visit>> {
	return useQuery([QUERY_KEYS.getVisits, props], () => VisitsService.getAllActiveVisits(props), {
		keepPreviousData: true,
	});
}
