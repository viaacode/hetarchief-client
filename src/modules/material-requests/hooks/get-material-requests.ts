import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper } from '@shared/types/api';

import { GetMaterialRequestsProps, MaterialRequestsService } from '../services';
import { MaterialRequest, MaterialRequestDetails } from '../types';

export const useGetMaterialRequests = (
	props: GetMaterialRequestsProps
): UseQueryResult<ApiResponseWrapper<MaterialRequest>> =>
	useQuery([QUERY_KEYS.getMaterialRequests, props], () => MaterialRequestsService.getAll(props), {
		keepPreviousData: true,
	});

export const useGetMaterialRequestById = (id: string): UseQueryResult<MaterialRequestDetails> =>
	useQuery([QUERY_KEYS.getMaterialRequestById, id], () => MaterialRequestsService.getById(id), {
		keepPreviousData: true,
	});
