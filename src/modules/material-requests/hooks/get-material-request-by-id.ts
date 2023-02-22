import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { MaterialRequestsService } from '../services';
import { MaterialRequestDetail } from '../types';

export const useGetMaterialRequestById = (
	id: string | null
): UseQueryResult<MaterialRequestDetail> =>
	useQuery([QUERY_KEYS.getMaterialRequestById, id], () => MaterialRequestsService.getById(id), {
		keepPreviousData: true,
	});
