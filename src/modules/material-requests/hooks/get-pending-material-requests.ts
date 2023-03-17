import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { GetMaterialRequestsProps, MaterialRequestsService } from '../services';
import { MaterialRequest } from '../types';

export const useGetPendingMaterialRequests = (
	props: GetMaterialRequestsProps
): UseQueryResult<IPagination<MaterialRequest>> =>
	useQuery(
		[QUERY_KEYS.getMaterialRequests, props],
		() =>
			MaterialRequestsService.getAll({
				...props,
				size: 500,
				isPending: true,
				isPersonal: true,
			}),
		{
			keepPreviousData: true,
		}
	);
