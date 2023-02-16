import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';
import { ApiResponseWrapper } from '@shared/types';

import { IeObjectsService } from '../services';
import { IeObject } from '../types';

export function useGetIeObjectsRelated(
	id: string,
	esIndex: string,
	meemooId: string,
	enabled = true
): UseQueryResult<ApiResponseWrapper<IeObject>> {
	return useQuery(
		[QUERY_KEYS.getIeObjectsRelated, { id }],
		() => IeObjectsService.getRelated(id, esIndex, meemooId),
		{
			keepPreviousData: true,
			enabled,
		}
	);
}
