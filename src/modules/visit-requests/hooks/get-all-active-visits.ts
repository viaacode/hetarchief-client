import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { Visit } from '@shared/types';
import { VisitsService } from '@visit-requests/services';
import { GetAllActiveVisitsProps } from '@visit-requests/services/visits/visits.service.types';

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
