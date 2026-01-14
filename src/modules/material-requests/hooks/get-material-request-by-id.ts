import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

import { MaterialRequestsService } from '../services';
import type { MaterialRequestDetail } from '../types';

export const useGetMaterialRequestById = (
	id: string | null
): UseQueryResult<MaterialRequestDetail | null> =>
	useQuery({
		queryKey: [QUERY_KEYS.getMaterialRequestById, id],
		queryFn: () => MaterialRequestsService.getById(id),
		placeholderData: keepPreviousData,
	});
