import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { Visit } from '@shared/types';
import { VisitsService } from '@visits/services';
import { GetVisitsProps } from '@visits/services/visits/visits.service.types';

export function useGetVisits(props: GetVisitsProps): UseQueryResult<IPagination<Visit>> {
	return useQuery(
		[QUERY_KEYS.getVisits, props],
		() => {
			console.log({ props });
			return VisitsService.getAll(props);
		},
		{
			keepPreviousData: true,
		}
	);
}
