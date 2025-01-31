import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { MaterialRequestMaintainer } from '@material-requests/types';
import { QUERY_KEYS } from '@shared/const/query-keys';

import { MaterialRequestsService } from '../services';

export const useGetMaterialRequestsMaintainers = (): UseQueryResult<MaterialRequestMaintainer[]> =>
	useQuery([QUERY_KEYS.getMaterialRequests], () => MaterialRequestsService.getMaintainers(), {
		keepPreviousData: true,
	});
