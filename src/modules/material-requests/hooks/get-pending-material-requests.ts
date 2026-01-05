import { QUERY_KEYS } from '@shared/const/query-keys';
import type { IPagination } from '@studiohyperdrive/pagination';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { type GetMaterialRequestsProps, MaterialRequestsService } from '../services';
import type { MaterialRequest } from '../types';

export const useGetPendingMaterialRequests = (
	props: GetMaterialRequestsProps,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = {}
): UseQueryResult<IPagination<MaterialRequest>> =>
	useQuery({
		queryKey: [QUERY_KEYS.getMaterialRequests, props],
		queryFn: () =>
			MaterialRequestsService.getAll({
				...props,
				size: 500,
				isPending: true,
				isPersonal: true,
			}),
		...options,
	});
