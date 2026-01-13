import { QUERY_KEYS } from '@shared/const/query-keys';
import type { IPagination } from '@studiohyperdrive/pagination';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

import { type GetMaterialRequestsProps, MaterialRequestsService } from '../services';
import type { MaterialRequest } from '../types';

export const useGetMaterialRequests = (
	props: GetMaterialRequestsProps,
	options: {
		enabled?: boolean;
	} = { enabled: true }
): UseQueryResult<IPagination<MaterialRequest>> =>
	useQuery({
		queryKey: [QUERY_KEYS.getMaterialRequests, props],
		queryFn: () => MaterialRequestsService.getAll(props),
		placeholderData: keepPreviousData,
		enabled: true,
		...options,
	});
