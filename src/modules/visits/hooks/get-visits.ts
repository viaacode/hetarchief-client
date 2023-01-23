import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { Visit } from '@shared/types';
import { ApiResponseWrapper } from '@shared/types/api';
import { VisitsService } from '@visits/services';
import { GetVisitsProps } from '@visits/services/visits/visits.service.types';

export function useGetVisits(props: GetVisitsProps): UseQueryResult<ApiResponseWrapper<Visit>> {
	return useQuery([QUERY_KEYS.getVisits, props], () => VisitsService.getAll(props), {
		keepPreviousData: true,
	});
}
